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
      <h2 className="section-heading">
        {app === 'vscode' ? 'VS Code' : 'Microsoft Word'} Shortcuts ({os.toUpperCase()})
      </h2>

      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="app-select" style={{ fontWeight: 500, marginRight: '0.75rem' }}>Choose App: </label>
        <select id="app-select" value={app} onChange={(e) => setApp(e.target.value)}>
          <option value="vscode">VS Code</option>
          <option value="word">Word</option>
        </select>
      </div>

      <table className="shortcut-table">
        <thead>
          <tr>
            <th>Action</th>
            <th>Shortcut</th>
          </tr>
        </thead>
        <tbody>
          {dataToShow.map((item, index) => (
            <tr key={index}>
              <td><strong>{item.action}</strong></td>
              <td>{formatKeys(os === 'mac' ? item.mac : item.windows)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? 'Show Less' : 'Show More'}
      </button>

      {customShortcuts.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3 className="section-heading">Custom Shortcuts</h3>
          <table className="shortcut-table">
            <thead>
              <tr>
                <th>Action</th>
                <th>Shortcut</th>
                <th>App</th>
              </tr>
            </thead>
            <tbody>
              {customShortcuts.map((item, index) => (
                <tr key={index}>
                  <td><strong>{item.action}</strong></td>
                  <td>{formatKeys(item.keys)}</td>
                  <td>{item.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ShortcutDocs;