import React, { useState, useEffect } from 'react';
import { loadShortcuts, saveShortcuts } from '../utils/storage';

/**
 * @function CustomShortcuts 
 * Allow users to add custom keyboard shortcuts for different applications.
 * @param {'mac'|'windows'} os - The current operating system.
 * @returns {JSX.Element} The rendered interface.
 */
function CustomShortcuts({ os }) {
  const [app, setApp] = useState(''); // The name of the app 
  const [keys, setKeys] = useState(''); // The keyboard shortcut
  const [action, setAction] = useState(''); // The action associated with the shortcut
  const [isListening, setIsListening] = useState(false); // Whether the component is currently recording key input.
  const [combo, setCombo] = useState(new Set()); //A Set to store combination of keys being pressed.

  useEffect(() => {
    /**
      * @function captureKeys 
      * Captures key events and updates the keys state.
      * @param {KeyboardEvent} e - The keyboard event.
     */
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

    /**
     * @function clearCombo 
     * Automatically stops listening shortly after key release andc Clears the key combination.
     */
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

  /**
   * @function handleAdd 
   * Adds a new custom shortcut to local storage. And reset the input fields.
   */
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
