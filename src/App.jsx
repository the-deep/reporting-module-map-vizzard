import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import MapVizzard from './components/MapVizzard';
import Timeline from './components/Timeline/Timeline';
import timelineData from './stories/Timeline.json';
import KPIs from './components/KPIs/KPIs';
import kpiData from './stories/KPIs.json';
import styles from './App.module.css';
import sudan from './stories/sudan.json';
import ukraine from './stories/ukraine.json';

const queryParameters = new URLSearchParams(window.location.search);
const config = queryParameters.get('config') || 'sudan';
const width = parseInt(queryParameters.get('width'), 10) || null;

let mapConfig = sudan;

if (config === 'ukraine.json') {
  mapConfig = ukraine;
}

let s = {};
if (width) s = { maxWidth: width };
function App() {
  return (
    <HashRouter>
      <Routes>
        <Route
          exact
          path="/ukraine/builder"
          element={
          (
            <div className={styles.App} style={s}>
              <MapVizzard mapConfig={ukraine} iframe={false} />
            </div>
          )
        }
        />
        <Route
          exact
          path="/ukraine"
          element={
          (
            <div className={styles.App} style={s}>
              <MapVizzard mapConfig={ukraine} iframe />
            </div>
          )
        }
        />
        <Route
          path="/ukraine/timeline"
          element={
          (
            <div className={styles.App} style={s}>
              <Timeline data={timelineData} />
            </div>
          )
        }
        />
        <Route
          path="/ukraine/kpis"
          element={
          (
            <div className={styles.App} style={s}>
              <KPIs data={kpiData} />
            </div>
          )
        }
        />
        <Route
          path="/ukraine/dashboard"
          element={
          (
            <div className={styles.App} style={s}>
              <KPIs data={kpiData} />
              <MapVizzard mapConfig={ukraine} iframe />
              <Timeline data={timelineData} />
            </div>
          )
        }
        />
        <Route
          path="/"
          element={
          (
            <div className={styles.App} style={s}>
              <MapVizzard mapConfig={mapConfig} iframe={false} />
            </div>
          )
        }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
