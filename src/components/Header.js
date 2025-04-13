import React from 'react';

function Header({ setView }) {
  return (
    <nav>
      <button onClick={() => setView('docs')}>Documentation</button>
      <button onClick={() => setView('trainer')}>Trainer</button>
      <button onClick={() => setView('results')}>Results</button>
      <button onClick={() => setView('custom')}>Custom Shortcuts</button>
    </nav>
  );
}

export default Header;

