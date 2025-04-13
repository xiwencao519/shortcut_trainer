import React from 'react';
import shortcuts from '../data/shortcutsData';
import { loadShortcuts } from '../utils/storage';

function ShortcutDocs({ os }) {
  const custom = loadShortcuts();
  const combined = { ...shortcuts, ...custom };

  const formatKeys = (keys) => {
    if (os === 'mac') return keys.replace(/Ctrl/g, 'Cmd');
    return keys.replace(/Cmd/g, 'Ctrl');
  };

  return (
    <div>
      {Object.keys(combined).map(app => (
        <div key={app}>
          <h3>{app}</h3>
          <ul>
            {combined[app].map((item, index) => (
              <li key={index}><strong>{formatKeys(item.keys)}</strong>: {item.action}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default ShortcutDocs;