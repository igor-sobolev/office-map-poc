import React, { useRef, useState, useEffect, useCallback } from 'react';
import { number, shape, array, string, bool } from 'prop-types';
import { useMaps } from '../../hooks/useMaps';
import { GMapWrapper } from '../../services/GMapWrapper';
import { useOfficeMap } from '../../providers/MapProvider';

const Map = ({ width, height }) => {
  const { setMap } = useOfficeMap();
  const mapRoot = useRef(null);
  const { isLoaded } = useMaps();

  useEffect(() => {
    if (isLoaded && mapRoot.current) {
      const appMap = new GMapWrapper(mapRoot.current);
      setMap(appMap);
    }
  }, [isLoaded, mapRoot]);

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
