import React from 'react';

import OfficeMap from '../OfficeMap/OfficeMap';
import MapProvider from '../../providers/MapProvider';

import './App.css';

const App = () => (
  <div className="App">
    <MapProvider>
      <OfficeMap />
    </MapProvider>
  </div>
); // @TODO: improve with routing

export default App;
