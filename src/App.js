import React, { useState } from 'react';
import ShortcutDocs from './components/ShortcutDocs';
import Trainer from './components/Trainer';
import Results from './components/Results';
import CustomShortcuts from './components/CustomShortcuts';
import { motion } from 'framer-motion';
import './components/Global.css';
import './components/Welcome.css';

/**
 * @function App
 * It controls the layout,handles navigation between views (welcome, docs, trainer, results, custom shortcuts),
 * It uses the `useState` to manage the current view, operating system, and selected app.
 * @returns {JSX.Element} The rendered interface.
 */

function App() {
  const [view, setView] = useState('welcome');
  const [os, setOs] = useState(navigator.platform.includes('Mac') ? 'mac' : 'windows');
  const [app, setApp] = useState('vscode');


  /**
   * @function toggleOs Toggles the operating system between 'mac' and 'windows'.
   */
  const toggleOs = () => {
    setOs(prev => (prev === 'mac' ? 'windows' : 'mac'));
  };


  /**
  * @function renderMain  Renders the appropriate main view component based on current state.
  */
  const renderMain = () => (
    <div className="main-content">
      {view === 'docs' && <ShortcutDocs os={os} app={app} setApp={setApp} />}
      {view === 'trainer' && <Trainer os={os} />}
      {view === 'results' && <Results />}
      {view === 'custom' && <CustomShortcuts os={os} />}
    </div>
  );

  // Render the initial welcome screen when loading
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
            Improve your productivity with keyboard shortcuts!<br />
            Practice and track your performance.
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

  // Render the main app layout with navbar and selected view
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