import React, { useEffect, useState, useRef } from 'react';
import vscodeData from '../data/vscodeShortcuts.json';
import wordData from '../data/wordShortcuts.json';
import { saveScore } from '../utils/storage';
import { loadShortcuts } from '../utils/storage';

// function arraysEqualIgnoreOrder(a, b) {
//     if (a.length !== b.length) return false;
//     const sortedA = [...a].sort();
//     const sortedB = [...b].sort();
//     return sortedA.every((val, index) => val === sortedB[index]);
//   }
  
//   function normalizeKeyLabel(key, os) {
//     if (key === 'meta') return 'cmd';
//     if (key === 'control') return 'ctrl';
//     if (key === 'alt') return os === 'mac' ? 'option' : 'alt';
//     if (key === 'arrowup') return 'up';
//     if (key === 'arrowdown') return 'down';
//     if (key === 'arrowleft') return 'left';
//     if (key === 'arrowright') return 'right';
//     return key;
//   }
  
//   function Trainer({ os }) {
//     const [difficulty, setDifficulty] = useState('easy');
//     const [source, setSource] = useState('vscode');
//     const [questions, setQuestions] = useState([]);
//     const [index, setIndex] = useState(0);
//     const [score, setScore] = useState(0);
//     const [feedback, setFeedback] = useState('');
//     const [done, setDone] = useState(false);
//     const [showHint, setShowHint] = useState(false);
//     const [incorrectList, setIncorrectList] = useState([]);
//     const keySet = useRef(new Set());
//     const processingRef = useRef(false);
//     const sequenceStage = useRef(null);
//     const sequenceTimeout = useRef(null);
  
//     const formatKeys = (keys) => {
//       if (os === 'mac') return keys.replace(/Ctrl/g, 'Cmd').replace(/Alt/g, 'Option');
//       return keys; // no replacement for Windows/Linux
//     };
  
//     const loadData = () => {
//       const custom = Object.entries(loadShortcuts()).flatMap(([appName, items]) =>
//         items.map(item => ({ ...item, app: appName, keys: item.keys }))
//       );
//       const full = source === 'vscode' ? vscodeData.map(x => ({ ...x, app: 'VSCode' }))
//                   : source === 'word' ? wordData.map(x => ({ ...x, app: 'Word' }))
//                   : custom;
//       const shuffled = full.sort(() => 0.5 - Math.random());
//       const count = difficulty === 'easy' ? 5 : 10;
//       return shuffled.slice(0, count);
//     };
  
//     const restart = () => {
//       setQuestions(loadData());
//       setIndex(0);
//       setScore(0);
//       setFeedback('');
//       setDone(false);
//       setShowHint(false);
//       setIncorrectList([]);
//       keySet.current.clear();
//       processingRef.current = false;
//       sequenceStage.current = null;
//       clearTimeout(sequenceTimeout.current);
//     };
  
//     useEffect(() => {
//       restart();
//     }, [difficulty, source]);
  
//     useEffect(() => {
//       const handleKeyDown = (e) => {
//         if (done || !questions[index] || processingRef.current) return;
//         e.preventDefault();
//         keySet.current.add(e.key.toLowerCase());
//       };
  
//       const handleKeyUp = (e) => {
//         if (done || !questions[index] || processingRef.current) return;
//         e.preventDefault();
  
//         const raw = os === 'mac' ? questions[index].mac || questions[index].keys : questions[index].windows || questions[index].keys;
//         const parts = raw.toLowerCase().split(',').map(p => p.trim());
  
//         if (parts.length === 2) {
//           const current = keySet.current;
//           const first = parts[0].split('+').map(k => k.trim());
//           const second = parts[1];
  
//           if (!sequenceStage.current) {
//             const pressed = Array.from(current).map(k => normalizeKeyLabel(k, os));
//             if (arraysEqualIgnoreOrder(pressed, first)) {
//               sequenceStage.current = second;
//               sequenceTimeout.current = setTimeout(() => sequenceStage.current = null, 2000);
//             } else {
//               feedbackAndNext(false, pressed, raw);
//             }
//           } else {
//             const finalKey = normalizeKeyLabel(e.key.toLowerCase(), os);
//             feedbackAndNext(finalKey === sequenceStage.current, [finalKey], raw);
//             sequenceStage.current = null;
//             clearTimeout(sequenceTimeout.current);
//           }
//         } else {
//           processingRef.current = true;
//           const expected = raw.toLowerCase().split('+').map(k => k.trim());
//           const pressed = Array.from(keySet.current).map(k => normalizeKeyLabel(k, os));
//           feedbackAndNext(arraysEqualIgnoreOrder(pressed, expected), pressed, raw);
//         }
//         keySet.current.clear();
//       };
  
//       const feedbackAndNext = (correct, pressed = [], expectedRaw = '') => {
//         const newScore = correct ? score + 1 : score;
//         if (!correct) setIncorrectList(prev => [...prev, questions[index]]);
//         setFeedback(
//           correct ? '✅ Correct!' : `❌ Incorrect! You pressed: ${pressed.join(' + ')} | Expected: ${formatKeys(expectedRaw)}`
//         );
//         setScore(newScore);
  
//         if (index + 1 < questions.length) {
//           setTimeout(() => {
//             setIndex(prev => prev + 1);
//             setFeedback('');
//             setShowHint(false);
//             processingRef.current = false;
//           }, 2000);
//         } else {
//           setTimeout(() => {
//             saveScore({
//               score: newScore,
//               difficulty,
//               source,
//               os,
//               timestamp: Date.now()
//             });
//             setDone(true);
//           }, 2000);
//         }
//       };
  
//       document.addEventListener('keydown', handleKeyDown, { capture: true });
//       document.addEventListener('keyup', handleKeyUp, { capture: true });
  
//       return () => {
//         document.removeEventListener('keydown', handleKeyDown, { capture: true });
//         document.removeEventListener('keyup', handleKeyUp, { capture: true });
//       };
//     }, [index, score, os, done, questions]);
  
//     if (done) {
//       return (
//         <div>
//           <h2>Your score: {score}/{questions.length}</h2>
//           {incorrectList.length > 0 && (
//             <div>
//               <h3>Incorrect Answers:</h3>
//               <ul>
//                 {incorrectList.map((item, idx) => (
//                   <li key={idx}>
//                     <strong>{item.action}</strong> ({item.app || 'Custom'}): {formatKeys(os === 'mac' ? item.mac || item.keys : item.windows || item.keys)}
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//           <button onClick={restart}>Retry</button>
//         </div>
//       );
//     }
  
//     if (!questions[index]) {
//       return <p>Loading questions...</p>;
//     }
  
//     return (
//       <div>
//         <h2>Keyboard Shortcut Trainer</h2>
  
//         <label>
//           Difficulty:
//           <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
//             <option value="easy">Easy</option>
//             <option value="hard">Hard</option>
//           </select>
//         </label>
  
//         <label>
//           App:
//           <select value={source} onChange={(e) => setSource(e.target.value)}>
//             <option value="vscode">VS Code</option>
//             <option value="word">Word</option>
//             <option value="custom">Custom</option>
//           </select>
//         </label>
  
//         <h3>Question {index + 1} of {questions.length}</h3>
//         <p><strong>{questions[index].action}</strong> ({questions[index].app || 'Custom'})</p>
  
//         {difficulty === 'easy' && (
//           <button onClick={() => setShowHint(true)}>Show Hint</button>
//         )}
  
//         {showHint && (
//           <p><em>Hint: {formatKeys(os === 'mac' ? questions[index].mac || questions[index].keys : questions[index].windows || questions[index].keys)}</em></p>
//         )}
  
//         <p>{feedback}</p>
//       </div>
//     );
//   }
  
//   export default Trainer;
  
function arraysEqualIgnoreOrder(a, b) {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, index) => val === sortedB[index]);
  }
  
  function normalizeKeyLabel(code, os) {
    if (code.startsWith('meta')) return 'cmd';
    if (code.startsWith('control')) return 'ctrl';
    if (code.startsWith('alt')) return os === 'mac' ? 'option' : 'alt';
    if (code.startsWith('shift')) return 'shift';
    if (code.startsWith('key')) return code.replace('key', '').toLowerCase();
    if (code.startsWith('digit')) return code.replace('digit', '');
    if (code === 'backquote') return '`';
    if (code === 'space') return 'space';
    if (code === 'arrowup') return 'up';
    if (code === 'arrowdown') return 'down';
    if (code === 'arrowleft') return 'left';
    if (code === 'arrowright') return 'right';
    return code.toLowerCase();
  }
  
  function Trainer({ os }) {
    const [difficulty, setDifficulty] = useState('easy');
    const [source, setSource] = useState('vscode');
    const [questions, setQuestions] = useState([]);
    const [index, setIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [done, setDone] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [incorrectList, setIncorrectList] = useState([]);
    const [retryIncorrect, setRetryIncorrect] = useState(false);
    const keySet = useRef(new Set());
    const processingRef = useRef(false);
    const sequenceStage = useRef(null);
    const sequenceTimeout = useRef(null);
  
    const formatKeys = (keys) => {
      if (os === 'mac') return keys.replace(/Ctrl/g, 'Cmd').replace(/Alt/g, 'Option');
      return keys;
    };
  
    const loadData = () => {
      const custom = Object.entries(loadShortcuts()).flatMap(([appName, items]) =>
        items.map(item => ({ ...item, app: appName, keys: item.keys }))
      );
      const full = source === 'vscode' ? vscodeData.map(x => ({ ...x, app: 'VSCode' }))
                  : source === 'word' ? wordData.map(x => ({ ...x, app: 'Word' }))
                  : custom;
      const shuffled = full.sort(() => 0.5 - Math.random());
      const count = difficulty === 'easy' ? 5 : 10;
      return shuffled.slice(0, count);
    };
  
    const restart = (fromIncorrect = false) => {
      const data = fromIncorrect && incorrectList.length > 0 ? incorrectList : loadData();
      setRetryIncorrect(fromIncorrect);
      setQuestions(data);
      setIndex(0);
      setScore(0);
      setFeedback('');
      setDone(false);
      setShowHint(false);
      setIncorrectList([]);
      keySet.current.clear();
      processingRef.current = false;
      sequenceStage.current = null;
      clearTimeout(sequenceTimeout.current);
    };
  
    useEffect(() => {
      restart();
    }, [difficulty, source]);
  
    useEffect(() => {
      const handleKeyDown = (e) => {
        if (done || !questions[index] || processingRef.current) return;
        e.preventDefault();
        keySet.current.add(e.code.toLowerCase());
      };
  
      const handleKeyUp = (e) => {
        if (done || !questions[index] || processingRef.current) return;
        e.preventDefault();
  
        const raw = os === 'mac' ? questions[index].mac || questions[index].keys : questions[index].windows || questions[index].keys;
        const parts = raw.toLowerCase().split(',').map(p => p.trim());
  
        if (parts.length === 2) {
          const current = keySet.current;
          const first = parts[0].split('+').map(k => k.trim());
          const second = parts[1];
  
          if (!sequenceStage.current) {
            const pressed = Array.from(current).map(k => normalizeKeyLabel(k, os));
            if (arraysEqualIgnoreOrder(pressed, first)) {
              sequenceStage.current = second;
              sequenceTimeout.current = setTimeout(() => sequenceStage.current = null, 2000);
            } else {
              feedbackAndNext(false, pressed, raw);
            }
          } else {
            const finalKey = normalizeKeyLabel(e.key.toLowerCase(), os);
            feedbackAndNext(finalKey === sequenceStage.current, [finalKey], raw);
            sequenceStage.current = null;
            clearTimeout(sequenceTimeout.current);
          }
        } else {
          processingRef.current = true;
          const expected = raw.toLowerCase().split('+').map(k => k.trim());
          const pressed = Array.from(keySet.current).map(k => normalizeKeyLabel(k, os));
          feedbackAndNext(arraysEqualIgnoreOrder(pressed, expected), pressed, raw);
        }
        keySet.current.clear();
      };
  
      const feedbackAndNext = (correct, pressed = [], expectedRaw = '') => {
        const newScore = correct ? score + 1 : score;
        if (!correct) setIncorrectList(prev => [...prev, questions[index]]);
        setFeedback(
          correct ? '✅ Correct!' : `❌ Incorrect! You pressed: ${pressed.join(' + ')} | Expected: ${formatKeys(expectedRaw)}`
        );
        setScore(newScore);
  
        if (index + 1 < questions.length) {
          setTimeout(() => {
            setIndex(prev => prev + 1);
            setFeedback('');
            setShowHint(false);
            processingRef.current = false;
          }, 2000);
        } else {
          setTimeout(() => {
            if (!retryIncorrect) {
              saveScore({
                score: newScore,
                difficulty,
                source,
                os,
                timestamp: Date.now()
              });
            }
            setDone(true);
          }, 2000);
        }
      };
  
      document.addEventListener('keydown', handleKeyDown, { capture: true });
      document.addEventListener('keyup', handleKeyUp, { capture: true });
  
      return () => {
        document.removeEventListener('keydown', handleKeyDown, { capture: true });
        document.removeEventListener('keyup', handleKeyUp, { capture: true });
      };
    }, [index, score, os, done, questions]);
  
    if (done) {
      return (
        <div>
          <h2>Your score: {score}/{questions.length}</h2>
          {incorrectList.length > 0 && (
            <div>
              <h3>Incorrect Answers:</h3>
              <ul>
                {incorrectList.map((item, idx) => (
                  <li key={idx}>
                    <strong>{item.action}</strong> ({item.app || 'Custom'}): {formatKeys(os === 'mac' ? item.mac || item.keys : item.windows || item.keys)}
                  </li>
                ))}
              </ul>
              <button onClick={() => restart(true)}>Practice Incorrect Questions Again</button>
            </div>
          )}
          <button onClick={() => restart(false)}>Retry Full Test</button>
        </div>
      );
    }
  
    if (!questions[index]) {
      return <p>Loading questions...</p>;
    }
  
    return (
      <div>
        <h2>Keyboard Shortcut Trainer</h2>
  
        <label>
          Difficulty:
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            <option value="easy">Easy</option>
            <option value="hard">Hard</option>
          </select>
        </label>
  
        <label>
          App:
          <select value={source} onChange={(e) => setSource(e.target.value)}>
            <option value="vscode">VS Code</option>
            <option value="word">Word</option>
            <option value="custom">Custom</option>
          </select>
        </label>
  
        <h3>Question {index + 1} of {questions.length}</h3>
        <p><strong>{questions[index].action}</strong> ({questions[index].app || 'Custom'})</p>
  
        {difficulty === 'easy' && (
          <button onClick={() => setShowHint(true)}>Show Hint</button>
        )}
  
        {showHint && (
          <p><em>Hint: {formatKeys(os === 'mac' ? questions[index].mac || questions[index].keys : questions[index].windows || questions[index].keys)}</em></p>
        )}
  
        <p>{feedback}</p>
      </div>
    );
  }
  
  export default Trainer;
  