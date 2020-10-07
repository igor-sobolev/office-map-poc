import React, { useCallback, useEffect, useState } from 'react';

import { Map } from '../Map';
import { useBuildings } from '../../hooks/useBuildings';

import './App.css';

const App = () => {
  const [building, setBuilding] = useState();
  const { isLoading, buildings } = useBuildings();
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

  if (isLoading) return 'Loading...';

  return (
    <div className="App">
      <select value={building.name} onChange={selectBuilding}>
        {buildings.map((building) => (
          <option value={building.name} key={building.name}>
            {building.name}
          </option>
        ))}
      </select>
      {building && <Map width={1024} height={648} building={building} />}
    </div>
  );
};

export default App;
