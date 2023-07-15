import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import MapVizzard from './components/MapVizzard';
import mapConfig from "./stories/mapConfig.json";
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.App}>
      <MapVizzard mapConfig={mapConfig}/>
    </div>
  );
}

export default App;