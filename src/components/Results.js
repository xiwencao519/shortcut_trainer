import React, { useEffect, useState } from 'react';
import { loadScores } from '../utils/storage';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Results() {
  const [scores, setScores] = useState([]);
  const [average, setAverage] = useState(0);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const history = loadScores();
    setScores(history);
    if (history.length > 0) {
      const total = history.reduce((sum, s) => sum + s.score, 0);
      setAverage((total / history.length).toFixed(2));
    }
  }, []);

  const visibleScores = showAll ? scores : scores.slice(-5);

  const chartData = {
    labels: scores.map((s, i) => `#${i + 1}`),
    datasets: [
      {
        label: 'Score',
        data: scores.map(s => s.score),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.3
      }
    ]
  };

  return (
    <div>
      <h2>Training History</h2>

      {scores.length === 0 ? (
        <p>No score history available yet.</p>
      ) : (
        <>
          <p><strong>Average Score:</strong> {average}</p>

          <Line data={chartData} />

          <table border="1" cellPadding="8" style={{ marginTop: '1em' }}>
            <thead>
              <tr>
                <th>Time</th>
                <th>Score</th>
                <th>App</th>
                <th>Mode</th>
                <th>OS</th>
              </tr>
            </thead>
            <tbody>
              {visibleScores.map((entry, i) => (
                <tr key={i}>
                  <td>{new Date(entry.timestamp).toLocaleString()}</td>
                  <td>{entry.score}</td>
                  <td>{entry.source}</td>
                  <td>{entry.difficulty}</td>
                  <td>{entry.os}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {scores.length > 5 && (
            <button onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show Less' : 'Show More'}
            </button>
          )}
        </>
      )}
    </div>
  );
}

export default Results;
