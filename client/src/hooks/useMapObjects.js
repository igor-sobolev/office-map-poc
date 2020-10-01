import { useState, useEffect } from 'react';

export const useMapObjects = () => {
  const [mapObjects, setMapObjects] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const response = await fetch('http://localhost:8080/objects');
        setMapObjects(await response.json());
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };

    makeRequest();
  }, []);

  return {
    error,
    isLoading,
    mapObjects,
  };
};
