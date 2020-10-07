import { useState, useEffect } from 'react';

export const useBuildings = () => {
  const [buildings, setBuildings] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const response = await fetch('http://localhost:8080/buildings');
        setBuildings(await response.json());
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
    buildings,
  };
};
