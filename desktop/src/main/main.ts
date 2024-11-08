import path from 'path';
import fs from 'fs';

import { app, BrowserWindow, shell, ipcMain, Notification } from 'electron';
import { autoUpdater } from 'electron-updater';
import { resolveHtmlPath } from './util';
import MenuBuilder from './menu';

app.setPath('userData', `c:/ms-ewlekari`);

let mainWindow: BrowserWindow | null = null;

autoUpdater.on('update-available', (info) => {});
autoUpdater.on('update-downloaded', (info) => {
  ipcMain.emit('new-update', info);
  autoUpdater.quitAndInstall();
});
ipcMain.on('exit', () => {
  // mainWindow.webContents.toggleDevTools();
  // return;
  mainWindow.minimize();
});

ipcMain.on('exit-se', () => {
  app.exit();
  app.relaunch();
});
ipcMain.on('minimize', () => {});
ipcMain.on('minimize', () => {});

///
ipcMain.on('play-new-message-notification', (e, arg) => {
  // player.play('test.wav', (err) => {
  //   console.log(err);
  // });
  if (mainWindow.isMinimized())
    new Notification({ title: arg.sender, body: arg.text }).show();
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) require('electron-debug')();

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    frame: !1,

    width: 1370,
    transparent: !1,
    height: 900,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });
};

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on(
  'certificate-error',
  (event, webContents, url, error, certificate, callback) => {
    // On certificate error we disable default behaviour (stop loading the page)
    // and we then say "it is all fine - true" to the callback
    event.preventDefault();
    callback(true);
  }
);

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // Create myWindow, load the rest of the app, etc...

  app
    .whenReady()
    .then(() => {
      createWindow();
      fs.readFile(path.join(__dirname, 'test.wav'), (dar, data) => {
        console.log('done');
        console.log(typeof data);
      });
      app.on('activate', () => {
        if (mainWindow === null) createWindow();
      });
      autoUpdater.checkForUpdatesAndNotify();
    })
    .catch(console.log);
}
