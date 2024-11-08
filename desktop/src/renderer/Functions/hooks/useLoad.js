import { useState, useEffect } from 'react';
import ErrorHandler from '../methods/Server/axiosErrorHandler';
import server from '../methods/Server/server';
import { $Files, db, findOne, insertOne } from '../methods/LocalDB/db';

export default function useLoad(msg, token) {
  const { file_id, is_pending, is_me } = msg;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function loadFile() {
      try {
        const file = await findOne($Files, { file_id });
        if (file) {
          setData(file.blob);
          setIsLoading(false);
          return;
        }
        if (is_pending) return;

        const axiosConfig = {
          headers: {
            Authorization: 'Bearer ' + token,
          },

          responseType: 'blob',
          onDownloadProgress: (progreeEvent) => {
            setProgress(
              ((progreeEvent.loaded * 100) / progreeEvent.total).toFixed(0)
            );
          },
        };
        setIsLoading(true);

        const blob = await server.get('/files/' + file_id, axiosConfig);
        insertOne($Files, { file_id, blob: blob.data });
        setData(blob.data);
        setIsLoading(false);
      } catch (err) {
        console.log('err');
        setError(ErrorHandler(err));
        setIsLoading(false);
      }
    }

    loadFile();
  }, [file_id, is_pending, token]);

  return { isLoading, data, error, progress };
}
