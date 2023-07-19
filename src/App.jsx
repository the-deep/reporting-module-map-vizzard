import React from 'react';
import MapVizzard from './components/MapVizzard';
import mapConfig from './stories/mapConfig.json';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.App}>
      <MapVizzard mapConfig={mapConfig} />
    </div>
  );
}

export default App;
