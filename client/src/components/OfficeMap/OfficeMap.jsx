import React, { useEffect, useState } from 'react';

import { Map } from '../Map';
import { useBuildings } from '../../hooks/useBuildings';
import { useObjects } from '../../hooks/useObjects';
import Select from '../Select/Select';
import { useOfficeMap } from '../../providers/MapProvider';

import styles from './OfficeMap.module.scss';

const OfficeMap = () => {
  const {
    building,
    setBuilding,
    addObject,
    setMoveMode,
    isMoveMode,
    selectedObject,
    onChangeHeightProportionHandler,
    onChangeRotationHandler,
    onChangeWidthProportionHandler,
  } = useOfficeMap();

  const [object, setObject] = useState();
  const {
    isLoading: isLoadingBuildings,
    buildings,
    error: buildingsError,
  } = useBuildings();
  const {
    isLoading: isLoadingObjects,
    objects,
    error: objectsError,
  } = useObjects();

  useEffect(() => {
    if (buildings && buildings.length) setBuilding(buildings[0]);
  }, [buildings, setBuilding]);

  if (objectsError || buildingsError) return 'Error!';

  if (isLoadingBuildings || isLoadingObjects) return 'Loading...';

  const menu = (
    <ul style={{ listStyle: 'none', border: '1px solid #cecece', padding: 0 }}>
      <li style={{ background: 'white' }}>add object</li>
      <li style={{ background: 'white' }}>remove object</li>
    </ul>
  );

  return (
    <>
      <div className={styles.controls}>
        {/* @TODO: separate to Controls component */}
        <Select
          value={building?.name}
          onChange={setBuilding}
          options={buildings}
        />
        <Select
          value={object?.name}
          onChange={setObject}
          options={objects}
          placeholder="Select object"
        />
        <button onClick={() => addObject(object)}>Add</button>
        <span className={styles.breakline} />
        {isMoveMode ? (
          <button onClick={() => setMoveMode(false)}>
            Disable Move Objects
          </button>
        ) : (
          <button onClick={() => setMoveMode(true)}>Move Objects</button>
        )}
      </div>

      <Map width={900} height={555} contextMenu={menu} />

      {selectedObject && (
        <div className={styles.selectedObject}>
          <p>{JSON.stringify(selectedObject)}</p>
          <label htmlFor="rotate">
            Rotate:{' '}
            <input
              type="range"
              min="0"
              max="360"
              value={selectedObject?.rotate}
              onChange={onChangeRotationHandler}
              id="rotate"
            />
            {selectedObject?.rotate}
          </label>
          <label htmlFor="widthProportion">
            Width:{' '}
            <input
              type="number"
              step="0.05"
              value={selectedObject?.proportions?.width}
              onChange={onChangeWidthProportionHandler}
              id="widthProportion"
            />
            {selectedObject?.proportions?.width}
          </label>
          <label htmlFor="heightProportion">
            Height:{' '}
            <input
              type="number"
              step="0.05"
              value={selectedObject?.proportions?.height}
              onChange={onChangeHeightProportionHandler}
              id="heightProportion"
            />
            {selectedObject?.proportions?.height}
          </label>
        </div>
      )}
    </>
  );
};

export default OfficeMap;
