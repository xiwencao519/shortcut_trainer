import React, { useState } from 'react';
import Header from './components/Header';
import ShortcutDocs from './components/ShortcutDocs';
import Trainer from './components/Trainer';
import Results from './components/Results';
import CustomShortcuts from './components/CustomShortcuts';

function App() {
  const [view, setView] = useState('docs');
  const [os, setOs] = useState(navigator.platform.includes('Mac') ? 'mac' : 'windows');
  const [app, setApp] = useState('vscode');

  const toggleOs = () => {
    setOs(prev => (prev === 'mac' ? 'windows' : 'mac'));
  };

  return (
    <div className="App">
      <Header setView={setView} os={os} toggleOs={toggleOs} />
      <p>Current OS Mode: {os} (<button onClick={toggleOs}>Toggle OS</button>)</p>
      {view === 'docs' && <ShortcutDocs os={os} app={app} setApp={setApp} />}
      {view === 'trainer' && <Trainer os={os} />}
      {view === 'results' && <Results />}
      {view === 'custom' && <CustomShortcuts os={os} />}
    </div>
  );
}

export default App;