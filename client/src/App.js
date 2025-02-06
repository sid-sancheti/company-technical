import React from 'react';
import {Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/list" element={<MainPage />} />
        <Route path="*" element={<Navigate to="/list" />} /> {/* Need to change: Defaults all other pages to /cves/list/ */}
      </Routes>
    </div>
  );
}

export default App;