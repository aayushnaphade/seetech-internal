/**
 * Main App component for the Proposal Generator
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProposalPreview } from './pages/ProposalPreview.jsx';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Navigate to="/proposal-preview" replace />} />
        <Route path="/proposal-preview" element={<ProposalPreview />} />
      </Routes>
    </div>
  );
}

export default App;