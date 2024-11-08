import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './Functions/methods/Authentication/ProtectedRoutes';
import { importInto } from 'dexie-export-import';
import Main from './Components/Main';
import Login from './Components/Authentication/Login';
import Register from './Components/Authentication/Register';
import CreateGroup from './Components/Administrator/CreateGroup';
import moment from 'moment';
moment.defineLocale('kr', {
  months: [
    'çileya paşîn',
    'sibat',
    'avdar',
    'nîsan',
    'gulan',
    'pûşber',
    'tîrmeh',
    'tebax',
    'Îlon',
    'cotmeh',
    'mijdar',
    'çileya pêşîn',
  ],

  weekdays: [
    'Yek şemb',
    'Du şemb',
    'Sê şemb',
    'Çar şemb',
    'Pênc şemb',
    'În',
    'Şemiyê',
  ],

  weekdaysMin: [
    'Yek şemb',
    'Du şemb',
    'Sê şemb',
    'Çar şemb',
    'Pênc şemb',
    'În',
    'Şemiyê',
  ],
  relativeTime: {
    past: 'bori',
    s: 'beri cend sani',
    m: 'beri deqeke',
    mm: '%d deqe',
    h: 'beri sqetek',
    hh: '%d seet',
    d: 'rojeke',
    dd: '%d roj',
    w: 'heftik',
    ww: '%d hefti',
    M: 'heyvek',
    MM: '%d heyv',
    y: 'a salek',
    yy: '%d sal',
  },

  calendar: {
    lastDay: '[Do seet] LT',
    sameDay: '[Îro seet] LT',
    nextDay: '[Sibe seet] LT',
    lastWeek: 'dddd [borî] [seet] LT',
    nextWeek: 'dddd [seet] LT',
    sameElse: 'L',
  },
});

import {
  $Messages,
  db,
  findAll,
  updateById,
} from './Functions/methods/LocalDB/db';

function App() {
  const userState = useState(null);
  const updateOne = window?.localStorage?.getItem('update4');

  const [databaseUpdated, setDatabaseUpdated] = useState(
    updateOne === 'yes' ? true : true
  );

  // useEffect(() => {
  //   async function updateDatabase() {
  //     try {
  //       const file = new Blob([JSON.stringify(data)]);
  //       await importInto(db, file);
  //       window?.localStorage?.setItem('update4', 'yes');
  //       setDatabaseUpdated(true);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }

  //   if (!databaseUpdated) updateDatabase();
  // }, [databaseUpdated]);

  if (!databaseUpdated) {
    return null;
  }
  return (
    <Router>
      <Routes>
        <Route element={<Login userState={userState} />} path="/login" />

        <Route element={<ProtectedRoutes userState={userState} />}>
          <Route
            element={<CreateGroup userState={userState} />}
            path="/admin/newgroup"
          />
          <Route
            element={<Register userState={userState} />}
            path="/admin/register"
          />
          <Route element={<Main userState={userState} />} path="/" />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
