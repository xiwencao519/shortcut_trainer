/**
 * @function saveShortcuts
 * Saves a dictionary of custom keyboard shortcuts to localStorage. The data is stored as a JSON string under the key `'customShortcuts'`.
 * @param {Object} shortcuts - A dictionary of shortcuts organized by app.
 * @example
 * saveShortcuts({ My_APP: [{ action: "Copy Line", keys: "Cmd+C" }] });
 */
export const saveShortcuts = (shortcuts) => {
  localStorage.setItem('customShortcuts', JSON.stringify(shortcuts));
};

/**
 * @function loadShortcuts
 * Loads custom keyboard shortcuts from localStorage. The shortcuts are stored under the key `'customShortcuts'`.
 * @returns {Object} - A dictionary of shortcuts organized by app.
 */
export const loadShortcuts = () => {
  const data = localStorage.getItem('customShortcuts');
  return data ? JSON.parse(data) : {};
};

/**
 * @typedef {Object} Score
 * @property {string} timestamp - When the score was recorded
 * @property {number} correct - Number of correct responses
 * @property {number} total - Total number of questions
 * @property {string} app - The app for which the score was recorded
 */

/**
 * @function saveScore
 * Saves a new score to localStorage under the key `'scores'`. 
 * @param {Score} score The score object to store.
 * @example
 * saveScore({ timestamp: "2025-04-22T14:00", correct: 8, total: 10, app: "vscode" });
 */
export const saveScore = (score) => {
  try {
    const scores = JSON.parse(localStorage.getItem('scores')) || [];
    scores.push(score);
    localStorage.setItem('scores', JSON.stringify(scores));
    console.log('Saved score:', score);
  } catch (e) {
    console.error('Failed to save score', e);
  }
};

/**
 * @function loadScores
 * Loads all saved scores from localStorage.
 * @returns {Score[]} An array of saved score objects.
 */
export const loadScores = () => {
  try {
    return JSON.parse(localStorage.getItem('scores')) || [];
  } catch (e) {
    console.error('Failed to load scores', e);
    return [];
  }
};