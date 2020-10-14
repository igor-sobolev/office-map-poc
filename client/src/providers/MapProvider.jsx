import React, { useCallback, useState, useEffect, useContext } from 'react';
import { createContext } from 'react';
import PropTypes from 'prop-types';
import { updateObjectsPosition } from '../services/building';
import { uuid } from '../helpers/uuid'; // @TODO: may be useless, just in case to need IDs

const MapCtx = createContext();

const MapProvider = ({ children }) => {
  const [map, setMap] = useState();
  const [building, setBuilding] = useState();
  const [selectedObject, setSelectedObject] = useState();
  const [isMoveMode, setMoveMode] = useState(false);
  const [objects, setObjects] = useState([]);

  const onObjectsUpdateHandler = useCallback(
    (objects) => {
      setObjects(objects);
      updateObjectsPosition(building, objects);
    },
    [building]
  );

  const onObjectSelectHandler = useCallback(
    (object) => {
      setSelectedObject(object);
    },
    [setSelectedObject]
  );

  const onChangeRotationHandler = useCallback(
    (event) => {
      const {
        target: { value },
      } = event;
      const modificatedObject = {
        ...selectedObject,
        rotate: Number.parseInt(value),
      };
      const modificatedObjects = objects.map((object) =>
        object.id === selectedObject.id ? modificatedObject : object
      );
      setSelectedObject(modificatedObject);
      setObjects(modificatedObjects);
      updateObjectsPosition(building, objects); // @TODO: update on server
    },
    [setObjects, objects, selectedObject, building]
  );

  const onChangeWidthProportionHandler = useCallback(
    (event) => {
      const {
        target: { value },
      } = event;
      const modificatedObject = {
        ...selectedObject,
        proportions: {
          ...selectedObject.proportions,
          width: Number.parseFloat(value),
        },
      };
      const modificatedObjects = objects.map((object) =>
        object.id === selectedObject.id ? modificatedObject : object
      );
      setSelectedObject(modificatedObject);
      setObjects(modificatedObjects);
      updateObjectsPosition(building, objects); // @TODO: update on server
    },
    [setObjects, objects, selectedObject, building]
  );

  const onChangeHeightProportionHandler = useCallback(
    (event) => {
      const {
        target: { value },
      } = event;
      const modificatedObject = {
        ...selectedObject,
        proportions: {
          ...selectedObject.proportions,
          height: Number.parseFloat(value),
        },
      };
      const modificatedObjects = objects.map((object) =>
        object.id === selectedObject.id ? modificatedObject : object
      );
      setSelectedObject(modificatedObject);
      setObjects(modificatedObjects);
      updateObjectsPosition(building, objects); // @TODO: update on server
    },
    [setObjects, objects, selectedObject, building]
  );

  useEffect(() => {
    if (map) map.onObjectsUpdate(onObjectsUpdateHandler);
  }, [map, onObjectsUpdateHandler]);

  useEffect(() => {
    if (map) map.onObjectSelect(onObjectSelectHandler);
  }, [map, onObjectSelectHandler]);

  useEffect(() => {
    if (building?.objects) setObjects(building.objects);
  }, [building]);

  useEffect(() => {
    if (map && building?.name) {
      map.setBuilding(building.name);
    }
  }, [map, building]);

  useEffect(() => {
    if (map && objects) {
      map.renderObjects(objects);
    }
  }, [map, objects, selectedObject]);

  useEffect(() => {
    setObjects((previousObjects) =>
      previousObjects.map((object) => ({ ...object, draggable: isMoveMode }))
    );
    setSelectedObject(
      (previousSelectedObject) =>
        previousSelectedObject && {
          ...previousSelectedObject,
          draggable: isMoveMode,
        }
    );
  }, [isMoveMode]);

  const addObject = useCallback(
    (object) => {
      setObjects((prevObjects) => [
        ...prevObjects,
        { ...object, draggable: isMoveMode, id: uuid(), rotate: 0 },
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
        selectedObject,
        onChangeHeightProportionHandler,
        onChangeWidthProportionHandler,
        onChangeRotationHandler,
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
