import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreateApplication from './pages/CreateApplication';
import CheckEligibility from './pages/CheckEligibility';
import ReadInstructions from './pages/ReadInstructions';
import RemoveApplication from './pages/RemoveApplication';
import AdminDashboard from './pages/AdminDashboard';

import Banner from './components/Banner';

function AppContent() {
  const location = useLocation();
  
  return (
    <div className="app-container">
      {/* Banner with flags only on subpages */}
      {location.pathname !== '/' && <Banner />}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/read-instructions" element={<ReadInstructions />} />
        <Route path="/create-application" element={<CreateApplication />} />
        <Route path="/check-eligibility" element={<CheckEligibility />} />
        <Route path="/remove-application" element={<RemoveApplication />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>

      {/* Footer */}
      <footer className="footer" style={{ position: 'relative', textAlign: 'center' }}>
        <p>Copyright © {new Date().getFullYear()} All Rights Reserved, VisaPortal IT Division</p>
        <p>Last update on {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
        
        {/* Discreet Admin Link */}
        <div style={{ position: 'absolute', bottom: '10px', right: '20px' }}>
          <Link to="/admin" style={{ color: '#0047ba', textDecoration: 'none', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold' }}>
            <span style={{ fontSize: '1.5rem' }}>🔒</span>
            <span style={{ fontSize: '1rem' }}>Staff Portal</span>
          </Link>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
