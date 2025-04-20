import React, { useState } from 'react';
import Header from './components/Header';
import ShortcutDocs from './components/ShortcutDocs';
import Trainer from './components/Trainer';
import Results from './components/Results';
import CustomShortcuts from './components/CustomShortcuts';
import { motion } from 'framer-motion';
import './components/Welcome.css';
import './index.css';

function App() {
  const [view, setView] = useState('welcome');
  const [os, setOs] = useState(navigator.platform.includes('Mac') ? 'mac' : 'windows');
  const [app, setApp] = useState('vscode');

  const toggleOs = () => {
    setOs(prev => (prev === 'mac' ? 'windows' : 'mac'));
  };

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
            Master your productivity with keyboard shortcuts!
            <br />
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
    <div className="App">
      <Header setView={setView} os={os} toggleOs={toggleOs} />
      <p className="text-sm text-gray-500 ml-4">Current OS Mode: {os} (<button onClick={toggleOs}>Toggle OS</button>)</p>
      {view === 'docs' && <ShortcutDocs os={os} app={app} setApp={setApp} />}
      {view === 'trainer' && <Trainer os={os} />}
      {view === 'results' && <Results />}
      {view === 'custom' && <CustomShortcuts os={os} />}
    </div>
  );
}

export default App;
