import React, { useEffect, useState, useRef } from 'react';
import vscodeData from '../data/vscodeShortcuts.json';
import wordData from '../data/wordShortcuts.json';
import { saveScore, loadShortcuts } from '../utils/storage';

/**
 * @function arraysEqualIgnoreOrder 
 * Compares two arrays for equality regardless of element order.
 * @param {Array} a - First array.
 * @param {Array} b - Second array.
 * @returns {boolean} True if arrays contain the same elements.
 */
function arraysEqualIgnoreOrder(a, b) {
  if (a.length !== b.length) return false;
  const sortedA = [...a].sort();
  const sortedB = [...b].sort();
  return sortedA.every((val, index) => val === sortedB[index]);
}

/**
 * @function normalizeKeyLabel 
 * Normalizes keyboard event codes for future comparison.
 * @param {string} code - Raw key string.
 * @param {'mac' | 'windows'} os - Operating system.
 * @returns {string} Normalized label.
 */
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
  if (code === 'slash') return '/';
  if (code === 'comma') return ',';
  return code.toLowerCase();
}


/**
 * @function Trainer Main function for practicing keyboard shortcuts for VS Code, Word, or customized shortcuts.
 * Provides interactive feedback, hint options, and a time limit under "hard mode".
 * @param {'mac' | 'windows'} props.os - Current operating system.
 * @returns {JSX.Element} Rendered interactive training interface.
 */
function Trainer({ os }) {
  const [difficulty, setDifficulty] = useState('easy'); //difficulty mode
  const [source, setSource] = useState('vscode'); //source of shortcuts
  const [questions, setQuestions] = useState([]); //questions to be asked
  const [index, setIndex] = useState(0); //question index
  const [score, setScore] = useState(0); //score
  const [feedback, setFeedback] = useState('');//feedback message
  const [done, setDone] = useState(false); //whether the test is done
  const [showHint, setShowHint] = useState(false); //whether to show hint
  const [showNext, setShowNext] = useState(false); //whether to show next question
  const [started, setStarted] = useState(false); //whether to start the test
  const [timeLeft, setTimeLeft] = useState(10); //time left for hard mode
  const showNextRef = useRef(false); //reference to showNext
  const keySet = useRef(new Set()); //set to store pressed keys
  const processingRef = useRef(false); //reference to check if processing
  const timer = useRef(null); //timer reference
  const indexRef = useRef(index); //reference to index
  const questionsRef = useRef(questions); //reference to questions

  useEffect(() => {
    showNextRef.current = showNext;
  }, [showNext]);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    questionsRef.current = questions;
  }, [questions]);

  /**
   * @function loadData 
   * Loads and ramdomly select shortcut questions based on selected app and difficulty.
   * @returns {Array} Array of selected shortcut questions.
   */
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

  /**
   * @function restart 
   * Resets the test state and reloads new question set.
   * @param {boolean} fromIncorrect - Whether to restart from an incorrect answer.
   */
  const restart = (fromIncorrect = false) => {
    const data = loadData();
    setQuestions(data);
    setIndex(0);
    setScore(0);
    setFeedback('');
    setDone(false);
    setShowHint(false);
    setShowNext(false);
    setStarted(false);
    keySet.current.clear();
    processingRef.current = false;
    clearInterval(timer.current);
    setTimeLeft(10);
  };

  /**
   * @function startTest 
   * Starts the test and sets up timer for hard mode.
  */
  const startTest = () => {
    setStarted(true);
    if (difficulty === 'hard') {
      setTimeLeft(10);
      timer.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev === 1) {
            clearInterval(timer.current);
            handleTimeout();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  /**
   * @function handleTimeout 
   * Handles the timeout event when time runs out.
   */
  const handleTimeout = () => {
    const currentIndex = indexRef.current;
    const currentQuestions = questionsRef.current;

    if (!showNextRef.current && !done && currentQuestions[currentIndex]) {
      const raw = os === 'mac'
        ? currentQuestions[currentIndex].mac || currentQuestions[currentIndex].keys
        : currentQuestions[currentIndex].windows || currentQuestions[currentIndex].keys;

      const expected = raw.toLowerCase().split('+').map(k => normalizeKeyLabel(k.trim(), os));
      feedbackAndNext(false, [], expected);
    }
  };

  /**
   * @function feedbackAndNext 
   * Updates feedback, score and prepares for the next question.
   * @param {boolean} correct - Whether the user's input was correct.
   * @param {Array} pressed - The keys pressed by the user.
   * @param {Array} expectedNormalized - The expected keys for the current question.
   */
  const feedbackAndNext = (correct, pressed = [], expectedNormalized = []) => {
    clearInterval(timer.current);
    const newScore = correct ? score + 1 : score;
    const toTitleCase = str => str.charAt(0).toUpperCase() + str.slice(1);
    const formatDisplay = (arr) => arr.map(toTitleCase).join(' + ');
    setFeedback(
      correct
        ? `✅ Correct! You pressed: ${formatDisplay(pressed)}`
        : `❌ Incorrect! You pressed: ${formatDisplay(pressed)} | Expected: ${formatDisplay(expectedNormalized)}`
    );
    setScore(newScore);
    setShowNext(true);
  };

  useEffect(() => {
    restart();
  }, [difficulty, source]);// Reload question set on difficulty or source change

  /**
   * Captures key combinations and compares with expected.
   */
  useEffect(() => {
    /**
      * @function handleKeyDown 
      * Handles keydown events and captures pressed keys.
      * @param {KeyboardEvent} e - The keyboard event.
     */
    const handleKeyDown = (e) => {
      if (done || !questions[index] || processingRef.current || showNext) return;
      e.preventDefault();
      keySet.current.add(e.code.toLowerCase());
    };


    /**
      * @function handleKeyUp 
      * Handles keyup events and checks if the pressed keys match the expected keys.
      * @param {KeyboardEvent} e - The keyboard event.
     */
    const handleKeyUp = (e) => {
      if (done || !questions[index] || processingRef.current || showNext) return;
      e.preventDefault();
      const raw = os === 'mac'
        ? questions[index].mac || questions[index].keys
        : questions[index].windows || questions[index].keys;

      const expected = raw.toLowerCase().split('+').map(k => normalizeKeyLabel(k.trim(), os));
      const pressed = Array.from(keySet.current).map(k => normalizeKeyLabel(k, os));

      processingRef.current = true;
      feedbackAndNext(arraysEqualIgnoreOrder(pressed, expected), pressed, expected);
      keySet.current.clear();
    };

    document.addEventListener('keydown', handleKeyDown, { capture: true });
    document.addEventListener('keyup', handleKeyUp, { capture: true });

    return () => {
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
      document.removeEventListener('keyup', handleKeyUp, { capture: true });
    };
  }, [index, score, os, done, questions, showNext, started]);

  /**
   * @function handleNextQuestion 
   * Transit to the next question or end the game(save score).
   */
  const handleNextQuestion = () => {
    if (index + 1 < questions.length) {
      setIndex(prev => prev + 1);
      setFeedback('');
      setShowHint(false);
      setShowNext(false);
      processingRef.current = false;
      setTimeLeft(10);
      if (difficulty === 'hard') {
        timer.current = setInterval(() => {
          setTimeLeft(prev => {
            if (prev === 1) {
              clearInterval(timer.current);
              handleTimeout();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } else {
      saveScore({
        score,
        difficulty,
        source,
        os,
        timestamp: Date.now()
      });
      setDone(true);
    }
  };

  if (done) {
    return (
      <div>
        <h2>Your score: {score}/{questions.length}</h2>
        <button onClick={() => restart(false)}>Retry Full Test</button>
      </div>
    );
  }

  if (!started) {
    return (
      <div>
        <h2 className="section-heading">Keyboard Shortcut Trainer</h2>
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
        <p style={{ marginTop: '10px', fontStyle: 'italic' }}>
          {difficulty === 'easy'
            ? 'Easy Mode: 5 questions with hint support.'
            : 'Hard Mode: 10 questions with 10-second timer and no hints.'}
        </p>
        <button onClick={startTest}>Start</button>
      </div>
    );
  }

  if (!questions[index]) {
    return <p>Loading questions...</p>;
  }

  return (
    <div>
      <h2 className="section-heading">Keyboard Shortcut Trainer</h2>

      <h3>Question {index + 1} of {questions.length}</h3>
      <p><strong>{questions[index].action}</strong> ({questions[index].app || 'Custom'})</p>

      {difficulty === 'easy' && !showNext && (
        <button onClick={() => setShowHint(true)}>Show Hint</button>
      )}

      {difficulty === 'hard' && !showNext && (
        <p style={{ color: 'red' }}>⏱️ Time Left: {timeLeft}s</p>
      )}

      {showHint && (
        <p><em>Hint: {os === 'mac' ? questions[index].mac || questions[index].keys : questions[index].windows || questions[index].keys}</em></p>
      )}

      <p>{feedback}</p>

      {showNext && (
        <button className="button-primary" onClick={handleNextQuestion}>Next Question</button>
      )}
    </div>
  );
}

export default Trainer;
