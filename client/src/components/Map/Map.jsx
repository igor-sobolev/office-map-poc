import React, { useRef, useState, useEffect } from 'react';
import { number } from 'prop-types';
import { useMaps } from '../../hooks/useMaps';
import { AppMap } from '../../services/AppMap';
import { useMapObjects } from '../../hooks/useMapObjects';

const Map = ({ width, height }) => {
  const [map, setMap] = useState();
  const mapRoot = useRef(null);
  const { isLoaded } = useMaps();
  const { mapObjects } = useMapObjects();

  useEffect(() => {
    if (isLoaded && mapRoot.current) {
      const appMap = new AppMap(mapRoot.current);
      setMap(appMap);
    }
  }, [isLoaded, mapRoot]);

  useEffect(() => {
    if (map && mapObjects) {
      map.renderObjects(mapObjects);
    }
  }, [mapObjects, map]);

  return (
    <div ref={mapRoot} style={{ width, height }}>
      {!isLoaded && 'Loading...'}
    </div>
  );
};

Map.propTypes = {
  width: number.isRequired,
  height: number.isRequired,
};

export default Map;
