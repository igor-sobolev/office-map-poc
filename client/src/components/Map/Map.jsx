import React, { useRef, useState, useEffect } from 'react';
import { number, shape, array, string } from 'prop-types';
import { useMaps } from '../../hooks/useMaps';
import { AppMap } from '../../services/AppMap';

const Map = ({ width, height, building }) => {
  const [map, setMap] = useState();
  const mapRoot = useRef(null);
  const { isLoaded } = useMaps();

  useEffect(() => {
    if (isLoaded && mapRoot.current) {
      const appMap = new AppMap(mapRoot.current);
      setMap(appMap);
    }
  }, [isLoaded, mapRoot]);

  useEffect(() => {
    if (map && building && building.objects && building.name) {
      map.setBuilding(building.name);
      map.renderObjects(building.objects);
      window.google.maps.event.trigger(map, 'resize');
    }
  }, [map, building]);

  if (!building) return null;

  return (
    <div ref={mapRoot} style={{ width, height }}>
      {!isLoaded && 'Loading...'}
    </div>
  );
};

Map.propTypes = {
  width: number.isRequired,
  height: number.isRequired,
  building: shape({
    name: string,
    objects: array,
  }),
};

export default Map;
