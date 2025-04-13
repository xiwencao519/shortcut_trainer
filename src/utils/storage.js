export const loadShortcuts = () => {
    const data = localStorage.getItem('customShortcuts');
    return data ? JSON.parse(data) : {};
  };
  
  export const saveShortcuts = (shortcuts) => {
    localStorage.setItem('customShortcuts', JSON.stringify(shortcuts));
  };
  
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
  
  export const loadScores = () => {
    try {
      return JSON.parse(localStorage.getItem('scores')) || [];
    } catch (e) {
      console.error('Failed to load scores', e);
      return [];
    }
  };