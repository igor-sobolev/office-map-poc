import { useEffect, useState } from 'react';
import { loadScript } from '../helpers/loadScript';

const googleConfig = { key: 'AIzaSyBvnXZrg53Z8PXJFy5Ey2bRWX6KblQgWpw' }; // can be moved outside

export const useMaps = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadScript(
      `https://maps.googleapis.com/maps/api/js?key=${googleConfig.key}`,
      () => {
        setIsLoaded(true);
      }
    );
  }, [setIsLoaded]);

  return {
    isLoaded,
  };
};
