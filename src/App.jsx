import React from 'react';
import MapVizzard from './components/MapVizzard';
import styles from './App.module.css';
import sudan from './stories/sudan.json';
import ukraine from './stories/ukraine.json';

const queryParameters = new URLSearchParams(window.location.search);
const config = queryParameters.get('config') || 'sudan';
let mapConfig;

if (config === 'ukraine.json') {
  mapConfig = ukraine;
} else {
  mapConfig = sudan;
}

function App() {
  return (
    <div className={styles.App}>
      <MapVizzard mapConfig={mapConfig} />
    </div>
  );
}

export default App;
