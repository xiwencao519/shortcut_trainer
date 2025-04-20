import React, { useState } from 'react';
import Header from './components/Header';
import ShortcutDocs from './components/ShortcutDocs';
import Trainer from './components/Trainer';
import Results from './components/Results';
import CustomShortcuts from './components/CustomShortcuts';
import { motion } from 'framer-motion';
import './components/Global.css';
import './components/Welcome.css';

function App() {
  const [view, setView] = useState('welcome');
  const [os, setOs] = useState(navigator.platform.includes('Mac') ? 'mac' : 'windows');
  const [app, setApp] = useState('vscode');

  const toggleOs = () => {
    setOs(prev => (prev === 'mac' ? 'windows' : 'mac'));
  };

  const renderMain = () => (
    <div className="main-content">
      {view === 'docs' && <ShortcutDocs os={os} app={app} setApp={setApp} />}
      {view === 'trainer' && <Trainer os={os} />}
      {view === 'results' && <Results />}
      {view === 'custom' && <CustomShortcuts os={os} />}
    </div>
  );

  if (view === 'welcome') {
    return (
      <div className="welcome-wrapper">
        <div className="welcome-overlay" />
        <motion.div
          className="welcome-card"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="welcome-title">Welcome to Shortcut Trainer</h1>
          <p className="welcome-desc">
            Master your productivity with keyboard shortcuts!<br />
            Practice, customize, and track your performance.
          </p>
          <motion.button
            onClick={() => setView('docs')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="welcome-button"
          >
            Enter Shortcut Trainer
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <nav className="navbar">
        <button onClick={() => setView('docs')}>Documentation</button>
        <button onClick={() => setView('trainer')}>Trainer</button>
        <button onClick={() => setView('results')}>Results</button>
        <button onClick={() => setView('custom')}>Custom Shortcuts</button>
        <div className="os-toggle-switch" >
          <span className="os-label">mac</span>
          <label className="switch">
            <input type="checkbox" checked={os === 'windows'} onChange={toggleOs} />
            <span className="slider fixed"></span>
          </label>
          <span className="os-label">windows</span>
        </div>
      </nav>
      {renderMain()}
    </div>
  );
}

export default App;