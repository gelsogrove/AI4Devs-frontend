import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AddCandidate from './components/AddCandidateForm';
import PositionKanban from './components/PositionKanban';
import Positions from './components/Positions';
import RecruiterDashboard from './components/RecruiterDashboard';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RecruiterDashboard />} />
        <Route path="/add-candidate" element={<AddCandidate />} />
        <Route path="/positions" element={<Positions />} />
        <Route path="/positions/:id" element={<PositionKanban />} />
        <Route path="*" element={<Navigate to="/positions" replace />} />
      </Routes>
    </Router>
  );
};

export default App;