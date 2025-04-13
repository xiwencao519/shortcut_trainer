import React from 'react';
import { loadScores } from '../utils/storage';

function Results() {
  const scores = loadScores();

  return (
    <div>
      <h3>Past Scores</h3>
      <ul>
        {scores.map((score, idx) => <li key={idx}>Session {idx + 1}: {score}</li>)}
      </ul>
    </div>
  );
}

export default Results;