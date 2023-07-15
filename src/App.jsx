import React from 'react';
import MapVizzard from './components/MapVizzard';
import mapConfig from "./stories/mapConfig.json";

import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

function App() {
  return (
    <div className="App">
      <MapVizzard mapConfig={mapConfig}/>
    </div>
  );
}

export default App;
