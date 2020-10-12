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
    </>
  );
};

export default OfficeMap;
