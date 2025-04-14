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
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    const history = loadScores();
    setScores(history);

    const groupedByApp = {};
    history.forEach(entry => {
      const app = entry.source || 'unknown';
      const mode = entry.difficulty || 'unknown';

      if (!groupedByApp[app]) groupedByApp[app] = {};
      if (!groupedByApp[app][mode]) groupedByApp[app][mode] = [];
      groupedByApp[app][mode].push(entry);
    });
    setGrouped(groupedByApp);
  }, []);

  const computeAverage = (entries) => {
    if (entries.length === 0) return 0;
    const total = entries.reduce((sum, e) => sum + e.score, 0);
    return (total / entries.length).toFixed(2);
  };

  const getChartData = (entries) => {
    return {
      labels: entries.map((_, i) => `#${i + 1}`),
      datasets: [
        {
          label: 'Score',
          data: entries.map(e => e.score),
          borderColor: 'rgb(54, 162, 235)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          tension: 0.3
        }
      ]
    };
  };

  return (
    <div>
      <h2>Training History (Grouped by App & Mode)</h2>
      {Object.entries(grouped).length === 0 ? (
        <p>No history available.</p>
      ) : (
        Object.entries(grouped).map(([app, modes], appIdx) => (
          <div key={appIdx} style={{ marginBottom: '3em' }}>
            <h3>App: {app}</h3>
            {Object.entries(modes).map(([mode, entries], modeIdx) => (
              <div key={modeIdx} style={{ marginBottom: '2em' }}>
                <h4>Mode: {mode} | Average Score: {computeAverage(entries)}</h4>
                <Line data={getChartData(entries)} style={{ maxWidth: '600px', marginBottom: '1em' }} />
                <table border="1" cellPadding="8">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Score</th>
                      <th>OS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries.map((entry, i) => (
                      <tr key={i}>
                        <td>{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : 'Invalid Date'}</td>
                        <td>{entry.score ?? '-'}</td>
                        <td>{entry.os ?? '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  );
}

export default Results;
