import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CVEList from './components/CVEList';
import NotFound from './components/NotFound';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/list" element={<CVEList />} /> {}
        <Route path="*" element={<Navigate to="/list" />} />  {}
      </Routes>
    </div>
  );
}

export default App;