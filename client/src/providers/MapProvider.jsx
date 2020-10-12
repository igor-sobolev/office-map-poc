import React, { useCallback, useState, useEffect, useContext } from 'react';
import { createContext } from 'react';
import PropTypes from 'prop-types';
import { updateObjectsPosition } from '../services/building';
import { convertMarkersToObjects } from '../helpers/objects';

const MapCtx = createContext();

const MapProvider = ({ children }) => {
  const [map, setMap] = useState();
  const [building, setBuilding] = useState();
  const [isMoveMode, setMoveMode] = useState(false);
  const [objects, setObjects] = useState([]);

  const onObjectsUpdateHandler = useCallback(
    (markers) => {
      const objects = markers
        .map(convertMarkersToObjects)
        .map((object) => ({ ...object, draggable: isMoveMode }));
      setObjects(objects);
      updateObjectsPosition(building, objects);
    },
    [building, isMoveMode]
  );

  useEffect(() => {
    if (map) map.onObjectsUpdate(onObjectsUpdateHandler);
  }, [map, onObjectsUpdateHandler]);

  useEffect(() => {
    if (building?.objects) setObjects(building.objects);
  }, [building]);

  useEffect(() => {
    if (map && building?.name && objects) {
      map.setBuilding(building.name);
    }
  }, [map, building, objects]);

  useEffect(() => {
    if (map && objects) {
      map.renderObjects(objects);
    }
  }, [map, objects]);

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
    [isMoveMode]
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
