// import React, { useState, useEffect } from 'react';
// import { loadShortcuts, saveShortcuts } from '../utils/storage';

// function CustomShortcuts({ os }) {
//   const [app, setApp] = useState('');
//   const [keys, setKeys] = useState('');
//   const [action, setAction] = useState('');
//   const [isListening, setIsListening] = useState(false);
//   const [combo, setCombo] = useState(new Set());

//   useEffect(() => {
//     const captureKeys = (e) => {
//       if (!isListening) return;
//       e.preventDefault();

//       const updatedCombo = new Set(combo);
//       if (e.ctrlKey && os === 'windows') updatedCombo.add('Ctrl');
//       if (e.metaKey && os === 'mac') updatedCombo.add('Cmd');
//       if (e.altKey) updatedCombo.add('Alt');
//       if (e.shiftKey) updatedCombo.add('Shift');
//       if (e.key && !['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) updatedCombo.add(e.key);

//       setCombo(updatedCombo);
//       setKeys(Array.from(updatedCombo).join('+'));
//     };

//     const clearCombo = () => {
//       if (isListening) {
//         setTimeout(() => {
//           setIsListening(false);
//           setCombo(new Set());
//         }, 500);
//       }
//     };

//     window.addEventListener('keydown', captureKeys);
//     window.addEventListener('keyup', clearCombo);

//     return () => {
//       window.removeEventListener('keydown', captureKeys);
//       window.removeEventListener('keyup', clearCombo);
//     };
//   }, [os, isListening, combo]);

//   const handleAdd = () => {
//     const current = loadShortcuts();
//     if (!current[app]) current[app] = [];
//     current[app].push({ keys, action });
//     saveShortcuts(current);
//     setApp(''); setKeys(''); setAction('');
//   };

//   return (
//     <div>
//       <h3>Add Custom Shortcut</h3>
//       <input value={app} onChange={e => setApp(e.target.value)} placeholder="App Name" />
//       <input value={keys} onClick={() => setIsListening(true)} readOnly placeholder="Click then type shortcut" />
//       <input value={action} onChange={e => setAction(e.target.value)} placeholder="Action" />
//       <button onClick={handleAdd}>Save</button>
//     </div>
//   );
// }

// export default CustomShortcuts;
import React, { useState, useEffect } from 'react';
import { loadShortcuts, saveShortcuts } from '../utils/storage';

function CustomShortcuts({ os }) {
  const [app, setApp] = useState('');
  const [keys, setKeys] = useState('');
  const [action, setAction] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [combo, setCombo] = useState(new Set());

  useEffect(() => {
    const captureKeys = (e) => {
      if (!isListening) return;
      e.preventDefault();

      const updatedCombo = new Set(combo);
      if (e.ctrlKey && os === 'windows') updatedCombo.add('Ctrl');
      if (e.metaKey && os === 'mac') updatedCombo.add('Cmd');
      if (e.altKey) updatedCombo.add('Alt');
      if (e.shiftKey) updatedCombo.add('Shift');
      if (e.key && !['Control', 'Shift', 'Alt', 'Meta'].includes(e.key)) updatedCombo.add(e.key);

      setCombo(updatedCombo);
      setKeys(Array.from(updatedCombo).join(' + '));
    };

    const clearCombo = () => {
      if (isListening) {
        setTimeout(() => {
          setIsListening(false);
          setCombo(new Set());
        }, 500);
      }
    };

    window.addEventListener('keydown', captureKeys);
    window.addEventListener('keyup', clearCombo);

    return () => {
      window.removeEventListener('keydown', captureKeys);
      window.removeEventListener('keyup', clearCombo);
    };
  }, [os, isListening, combo]);

  const handleAdd = () => {
    const current = loadShortcuts();
    if (!current[app]) current[app] = [];
    current[app].push({ keys, action });
    saveShortcuts(current);
    setApp(''); setKeys(''); setAction('');
  };

  return (
    <div className="custom-shortcut-container">
      <h2 className="section-heading">Add Custom Shortcut</h2>
      <div className="custom-shortcut-form">
        <input 
          value={app} 
          onChange={e => setApp(e.target.value)} 
          placeholder="App Name"
          className="custom-shortcut-input"
        />
        <input 
          value={keys} 
          onClick={() => setIsListening(true)} 
          readOnly 
          placeholder="Click then type shortcut"
          className={`custom-shortcut-input ${isListening ? 'active' : ''}`}
        />
        <input 
          value={action} 
          onChange={e => setAction(e.target.value)} 
          placeholder="Action"
          className="custom-shortcut-input"
        />
        <button 
          onClick={handleAdd}
          className="custom-shortcut-button"
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default CustomShortcuts;
