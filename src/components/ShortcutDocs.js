import React, { useState } from 'react';
import vscodeData from '../data/vscodeShortcuts.json';
import wordData from '../data/wordShortcuts.json';
import { loadShortcuts } from '../utils/storage';


/**
 * @function ShortcutDocs
 * A documentation viewer for keyboard shortcuts. Displays default and custom shortcuts
 * based on the selected application (VS Code or Word) and the current operating system.
 * @param {'mac'|'windows'} os - The current operating system context.
 * @param {'vscode'|'word'} app - The currently selected application.
 * @param {'vscode'|'word'} setApp - Update the current app name.
 * 
 * @returns {JSX.Element} The rendered shortcut documentation component.
 */
function ShortcutDocs({ os, app, setApp }) {
  const [showAll, setShowAll] = useState(false); //Control whether all shortcuts or just the top 10 are shown.
  const custom = loadShortcuts();

  /**
   * @function customShortcuts
   * Flattens the custom shortcuts data structure into a single array.
   */
  const customShortcuts = Object.entries(custom).flatMap(([appName, items]) =>
    items.map(item => ({ ...item, source: appName }))
  );

  const data = app === 'vscode' ? vscodeData : app === 'word' ? wordData : []; //Shortcut data for the selected app from the JSON files.
  const dataToShow = showAll ? data : data.slice(0, 10); //Limits to top 10 shortcuts unless showAll is true.

  return (
    <div>
      <h2 className="section-heading">
        {app === 'vscode' ? 'VS Code' : 'Microsoft Word'} Shortcuts ({os.toUpperCase()})
      </h2>

      <div>
        <label htmlFor="app-select">Choose App: </label>
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
              <td>{os === 'mac' ? item.mac : item.windows}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <button onClick={() => setShowAll(!showAll)}>
        {showAll ? 'Show Less' : 'Show More'}
      </button>

      {customShortcuts.length > 0 && (
        <div>
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
                  <td>{item.keys}</td>
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