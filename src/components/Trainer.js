import React, { useEffect, useState, useRef } from 'react';
import shortcuts from '../data/shortcutsData';
import { saveScore } from '../utils/storage';

function arraysEqualIgnoreOrder(a, b) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, index) => val === sortedB[index]);
}

function normalizeKeyLabel(key) {
  if (key === 'meta') return 'cmd';
  if (key === 'control') return 'ctrl';
  return key;
}

function Trainer({ os }) {
  const allShortcuts = Object.values(shortcuts).flat().filter(Boolean);
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [done, setDone] = useState(false);
  const keySet = useRef(new Set());
  const processingRef = useRef(false);

  const formatKeys = (keys) => {
    if (os === 'mac') return keys.replace(/Ctrl/g, 'Cmd');
    return keys.replace(/Cmd/g, 'Ctrl');
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (done || !allShortcuts[index] || processingRef.current) return;
      e.preventDefault();
      keySet.current.add(e.key.toLowerCase());
    };

    const handleKeyUp = (e) => {
      if (done || !allShortcuts[index] || processingRef.current) return;
      e.preventDefault();
      processingRef.current = true;

      const expected = formatKeys(allShortcuts[index].keys).toLowerCase().split('+').map(k => k.trim());
      const pressedRaw = Array.from(keySet.current);
      const pressed = pressedRaw.map(normalizeKeyLabel);
      keySet.current.clear();

      const correct = arraysEqualIgnoreOrder(pressed, expected);
      const newScore = correct ? score + 1 : score;

      setFeedback(correct ? '✅ Correct!' : `❌ Incorrect! You pressed: ${pressed.join('+')}`);
      setScore(newScore);

      if (index + 1 < allShortcuts.length) {
        setTimeout(() => {
          setIndex(prev => prev + 1);
          setFeedback('');
          processingRef.current = false;
        }, 1000);
      } else {
        setTimeout(() => {
          saveScore(newScore);
          setDone(true);
        }, 1000);
      }
    };

    document.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('keyup', handleKeyUp, { capture: true });

    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('keyup', handleKeyUp, { capture: true });
    };
  }, [index, score, os, done, allShortcuts]);

  if (done) {
    return <h2>Your score: {score}</h2>;
  }

  if (!allShortcuts[index]) {
    return <p>Loading shortcut...</p>;
  }

  return (
    <div tabIndex={0} style={{ outline: 'none' }}>
      <h3>Press the keys for: {allShortcuts[index].action}</h3>
      <p>(Hint: {formatKeys(allShortcuts[index].keys)})</p>
      <p>{feedback}</p>
    </div>
  );
}

export default Trainer;