import React, { useRef, useEffect } from 'react';
import { number, node } from 'prop-types';
import { useMaps } from '../../hooks/useMaps';
import { GMapWrapper } from '../../services/GMapWrapper';
import { useOfficeMap } from '../../providers/MapProvider';

const Map = ({ width, height, contextMenu }) => {
  const { setMap } = useOfficeMap();
  const rootRef = useRef(null);
  const contextMenuRef = useRef(null);
  const { isLoaded } = useMaps();

  useEffect(() => {
    if (isLoaded && rootRef?.current && contextMenuRef?.current) {
      const appMap = new GMapWrapper(rootRef.current, contextMenuRef.current);
      setMap(appMap);
    }
  }, [isLoaded, rootRef, contextMenuRef, setMap]);

  return !isLoaded ? (
    'Loading...'
  ) : (
    <>
      <div ref={rootRef} style={{ width, height }}></div>
      <div ref={contextMenuRef}>{contextMenu}</div>
    </>
  );
};

Map.propTypes = {
  width: number.isRequired,
  height: number.isRequired,
  contextMenu: node,
};

export default Map;
