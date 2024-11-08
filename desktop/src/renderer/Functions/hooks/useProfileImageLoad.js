import { useState, useEffect } from 'react';
import ErrorHandler from '../methods/Server/axiosErrorHandler';
import server from '../methods/Server/server';

export default function useProfileImageLoad(number) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    async function loadFile() {
      setData(null);
      setIsLoading(true);
      setError(null);
      try {
        const axiosConfig = {
          responseType: 'blob',

          onDownloadProgress: (progreeEvent) => {
            setProgress(
              ((progreeEvent.loaded * 100) / progreeEvent.total).toFixed(0)
            );
          },
        };
        if (number === null) return;
        setIsLoading(true);
        const blob = await server.get('/profileimages/' + number, axiosConfig);
        setData(blob.data);
        setIsLoading(false);
      } catch (err) {
        setError(ErrorHandler(err));
        setIsLoading(false);
        setData(null);
      }
    }

    loadFile();
  }, [number]);

  return { isLoading, data, error, progress };
}
