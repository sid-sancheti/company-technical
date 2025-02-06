import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CVEList from './components/CVEList'; // Component for the CVE list

function App() {
  return (
    <Router basename="/cves"> {/* Important: The basename prop */}
      <Routes>
        <Route path="/list" element={<CVEList />} /> {}
        <Route path="/" element={<Navigate to="/list" />} /> {}
        <Route path="*" element={<NotFound />} />  {/* Example of a 404 page */}
      </Routes>
    </Router>
  );
}

export default App;