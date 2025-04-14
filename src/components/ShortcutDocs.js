import React, { useState } from 'react';
import vscodeData from '../data/vscodeShortcuts.json';
import wordData from '../data/wordShortcuts.json';
import { loadShortcuts } from '../utils/storage';

function ShortcutDocs({ os, app, setApp }) {
    const [showAll, setShowAll] = useState(false);
    const custom = loadShortcuts();
    const customShortcuts = Object.entries(custom).flatMap(([appName, items]) =>
      items.map(item => ({ ...item, source: appName }))
    );
  
    const data = app === 'vscode' ? vscodeData : app === 'word' ? wordData : [];
    const dataToShow = showAll ? data : data.slice(0, 10);
  
    const formatKeys = (keys) => {
      if (os === 'mac') return keys.replace(/Ctrl/g, 'Cmd').replace(/Alt/g, 'Option');
      return keys.replace(/Cmd/g, 'Ctrl').replace(/Option/g, 'Alt');
    };
  
    return (
      <div>
        <h2>{app === 'vscode' ? 'VS Code' : 'Microsoft Word'} Shortcuts ({os.toUpperCase()})</h2>
  
        <label htmlFor="app-select">Choose App: </label>
        <select id="app-select" value={app} onChange={(e) => setApp(e.target.value)}>
          <option value="vscode">VS Code</option>
          <option value="word">Word</option>
        </select>
  
        <ul>
          {dataToShow.map((item, index) => (
            <li key={index}>
              <strong>{item.action}:</strong> {formatKeys(os === 'mac' ? item.mac : item.windows)}
            </li>
          ))}
        </ul>
  
        <button onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : 'Show More'}
        </button>
  
        <div>
          <h3>Custom Shortcuts</h3>
          <ul>
            {customShortcuts.map((item, index) => (
              <li key={index}>
                <strong>{item.action}:</strong> {formatKeys(item.keys)} <em>(App: {item.source})</em>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  
  export default ShortcutDocs;