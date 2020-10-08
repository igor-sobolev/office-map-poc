import React, { useCallback, useEffect, useState } from 'react';

import { Map } from '../Map';
import { useBuildings } from '../../hooks/useBuildings';

const OfficeMap = () => {
  const [building, setBuilding] = useState();
  const { isLoading, buildings, error } = useBuildings();
  const selectBuilding = useCallback(
    (e) => {
      const building = buildings.find(
        (currentBuilding) => currentBuilding.name === e.target.value
      );

      if (building) setBuilding(building);
    },
    [buildings]
  );

  useEffect(() => {
    if (buildings && buildings.length) setBuilding(buildings[0]);
  }, [buildings]);

  if (error) return 'Error!';

  if (isLoading) return 'Loading...';

  return (
    <>
      <select value={building.name} onChange={selectBuilding}>
        {buildings.map((building) => (
          <option value={building.name} key={building.name}>
            {building.name}
          </option>
        ))}
      </select>
      {building && <Map width={900} height={555} building={building} />}
    </>
  );
};

export default OfficeMap;
