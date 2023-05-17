import React from 'react';
import logo from './logo.svg';
import './App.css';
import Main from './components/Map';

function App() {
  return (
    <div className="App">
      <Main height={355} center={[30.21, 15.86]} zoom={5}>

      </Main>
    </div>
  );
}

export default App;
