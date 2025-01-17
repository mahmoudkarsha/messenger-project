import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './Assets/css/index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// calling IPC exposed from preload script
window.electron.ipcRenderer.once('ipc-example', (arg) => {
  // eslint-disable-next-line no-console
  console.log(arg);
});
window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
