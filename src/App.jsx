import React from 'react';
import MapVizzard from './components/MapVizzard';
import styles from './App.module.css';
import sudan from './stories/sudan.json';
import sudanBasemap from './stories/sudan-basemap.json';
import ukraine from './stories/ukraine.json';

const queryParameters = new URLSearchParams(window.location.search);
const config = queryParameters.get('config') || 'sudan';
const width = parseInt(queryParameters.get('width'), 10) || null;

let mapConfig;

if (config === 'ukraine.json') {
  mapConfig = ukraine;
} else if (config === 'sudan-basemap.json') {
  mapConfig = sudanBasemap;
} else {
  mapConfig = sudan;
}
let s = {};
if (width) s = { maxWidth: width };
function App() {
  return (
    <div className={styles.App} style={s}>
      <MapVizzard mapConfig={mapConfig} />
    </div>
  );
}

export default App;
