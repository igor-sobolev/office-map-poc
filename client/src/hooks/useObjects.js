import { useState, useEffect } from 'react';

export const useObjects = () => {
  const [objects, setObjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const response = await fetch('http://localhost:8080/buildings/objects'); // @TODO: improve with reverse proxy or smth similar
        setObjects(await response.json());
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
    objects,
  };
};
