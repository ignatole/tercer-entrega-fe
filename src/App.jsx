import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Portada from './pages/Portada';
import Bitacora from './pages/Bitacora';
import Integrantes from './pages/Integrantes';
import APIData from './pages/APIData';
import JSONData from './pages/JSONData';
import SideBar from './components/SideBar';
import Footer from './components/Footer';
import Portal from './components/Portal';
import './styles/App.css';

function AppContent() {
  const [portalVisible, setPortalVisible] = useState(false);
  const [portalDuration, setPortalDuration] = useState(1500);
  const [portalPhase, setPortalPhase] = useState('idle');
  const [setTargetPath] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const contentRef = useRef(null);

  const IN_DURATION = 700;
  const OUT_DURATION = 800;


  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.classList.remove('absorbed', 'from-portal');
    }
  }, [location.pathname]);

  const startPortalNavigation = (path) => {
  if (!path || path === location.pathname) return;
  if (portalPhase !== 'idle') return;

  setPortalPhase('in');
    setPortalVisible(true);
    setPortalDuration(IN_DURATION + OUT_DURATION);
    if (contentRef.current) {
      contentRef.current.classList.add('absorbed');
      contentRef.current.classList.remove('from-portal');
    }

    
    setTimeout(() => {
      navigate(path);
      setPortalPhase('out');
      
      if (contentRef.current) {
        contentRef.current.classList.remove('absorbed');
        contentRef.current.classList.add('from-portal');
      }
    }, IN_DURATION);

    
    setTimeout(() => {
      setPortalVisible(false);
      setPortalPhase('idle');
      setTargetPath(null);
      if (contentRef.current) {
        contentRef.current.classList.remove('absorbed', 'from-portal');
      }
    }, IN_DURATION + OUT_DURATION + 50);
  };

  return (
    <div className="app-container">
      <SideBar onNavigate={startPortalNavigation} />
      <main ref={contentRef} className="app-content">
        <Routes>
          <Route path="/" element={<Portada />} />
          <Route path="/bitacora" element={<Bitacora />} />
          <Route path="/integrantes" element={<Integrantes />} />
          <Route path="/json-data" element={<JSONData />} />
          <Route path="/api-data" element={<APIData />} />
        </Routes>
      </main>
      <Portal open={portalVisible} duration={portalDuration} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <AppContent />
        <Footer />
      </div>
    </Router>
  );
}

export default App;
