import { useState, useEffect } from 'react';
import { addIdentifiers } from '../helpers/buldings';

export const useBuildings = () => {
  const [buildings, setBuildings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const makeRequest = async () => {
      try {
        const response = await fetch('http://localhost:8080/buildings'); // @TODO: improve with reverse proxy or smth similar
        const buildings = await response.json();
        const buildingsWithId = addIdentifiers(buildings);
        setBuildings(buildingsWithId);
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
