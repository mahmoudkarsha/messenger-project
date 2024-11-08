import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { findOne, $Users } from '../LocalDB/db';

export default function ProtectedRoute({ userState, admins, ...props }) {
  const [user, setUser] = userState;
  const [databaseError, setDatabaseError] = useState(null);
  const [databaseLoading, setDatabaseLoadig] = useState(false);

  useEffect(() => {
    setDatabaseLoadig(true);
    findOne($Users, { active: 'yes' })
      .then((user) => {
        if (!user) {
          setDatabaseError('No User');
          return;
        }
        setUser(user);
      })
      .catch((err) => {
        setDatabaseError(err.message);
      })
      .finally(() => {
        setDatabaseLoadig(false);
      });
  }, []);

  if (databaseLoading) {
    return <h1>Loading Database</h1>;
  }

  if (databaseError) {
    return <Navigate to="/login" />;
  }

  if (user) {
    return <Outlet />;
  }

  return <p></p>;
}
