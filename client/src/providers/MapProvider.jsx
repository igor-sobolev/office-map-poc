import React, { useCallback, useState, useEffect, useContext } from 'react';
import { createContext } from 'react';
import PropTypes from 'prop-types';
import { updateObjectsPosition } from '../services/building';

const MapCtx = createContext();

const MapProvider = ({ children }) => {
  const [map, setMap] = useState();
  const [building, setBuilding] = useState();
  const [isMoveMode, setMoveMode] = useState(false);
  const [objects, setObjects] = useState([]);

  const syncFunction = useCallback(
    (markers) => updateObjectsPosition(building, markers),
    [building]
  );

  useEffect(() => {
    if (map) map.setObjectsUpdateCallback(syncFunction);
  }, [map, syncFunction]);

  useEffect(() => {
    if (building?.objects) setObjects(building.objects);
  }, [building]);

  useEffect(() => {
    if (map && building?.name && objects) {
      map.setBuilding(building.name);
      map.renderObjects(objects);
    }
    console.log(objects);
  }, [map, building, objects]);

  useEffect(() => {
    setObjects((previousObjects) =>
      previousObjects.map((object) => ({ ...object, draggable: isMoveMode }))
    );
  }, [isMoveMode]);

  const addObject = useCallback(
    (object) => {
      setObjects((prevObjects) => [
        ...prevObjects,
        { ...object, draggable: isMoveMode },
      ]);
    },
    [objects]
  );

  return (
    <MapCtx.Provider
      value={{
        map,
        setMap,
        building,
        setBuilding,
        addObject,
        isMoveMode,
        setMoveMode,
      }}
    >
      {children}
    </MapCtx.Provider>
  );
};

MapProvider.propTypes = {
  children: PropTypes.node,
};

export const useOfficeMap = () => useContext(MapCtx);

export default MapProvider;
