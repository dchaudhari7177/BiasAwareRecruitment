import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadResume from './components/UploadResume';
import Dashboard from './components/Dashboard';
import BiasReport from './components/BiasReport';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadResume />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/bias-report" element={<BiasReport />} />
      </Routes>
    </Router>
  );
}

export default App;
