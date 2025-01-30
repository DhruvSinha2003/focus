import React, { useEffect, useState } from "react";
import { FiPause, FiPlay, FiSettings } from "react-icons/fi";
import "./components.css";

const Timer = () => {
  const [showSettings, setShowSettings] = useState(true);
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setBreakDuration] = useState(5);
  const [timeLeft, setTimeLeft] = useState(focusDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [position, setPosition] = useState({
    x: (window.innerWidth - 300) / 2,
    y: (window.innerHeight - 400) / 2,
  });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const componentWidth = 300;
  const componentHeight = 400;

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (isDragging) {
        const newX = Math.max(
          0,
          Math.min(event.clientX - offset.x, window.innerWidth - componentWidth)
        );
        const newY = Math.max(
          0,
          Math.min(
            event.clientY - offset.y,
            window.innerHeight - componentHeight
          )
        );
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleSelectStart = (event) => {
      if (isDragging) {
        event.preventDefault();
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("selectstart", handleSelectStart);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("selectstart", handleSelectStart);
    };
  }, [isDragging, offset]);

  const handleMouseDown = (event) => {
    const boundingBox = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - boundingBox.left;
    const offsetY = event.clientY - boundingBox.top;
    setOffset({ x: offsetX, y: offsetY });
    setIsDragging(true);
  };

  useEffect(() => {
    let interval;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsBreak(!isBreak);
      setTimeLeft(isBreak ? focusDuration * 60 : breakDuration * 60);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, isBreak, focusDuration, breakDuration]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div
      className="glass-panel timer-container slide-in"
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        width: componentWidth,
        height: componentHeight,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      {showSettings ? (
        <>
          <h2 className="timer-heading">Pomodoro Timer</h2>
          <div className="timer-inputs">
            <label>Focus Duration (minutes)</label>
            <input
              type="number"
              value={focusDuration}
              onChange={(e) => setFocusDuration(parseInt(e.target.value))}
            />
          </div>
          <div className="timer-inputs">
            <label>Break Duration (minutes)</label>
            <input
              type="number"
              value={breakDuration}
              onChange={(e) => setBreakDuration(parseInt(e.target.value))}
            />
          </div>
          <button
            className="timer-button"
            onClick={() => {
              setShowSettings(false);
              setTimeLeft(focusDuration * 60);
              setIsRunning(true); // Start the timer when settings are saved
            }}
          >
            Start Timer
          </button>
        </>
      ) : (
        <>
          <div className="timer-display">
            {String(minutes).padStart(2, "0")}:
            {String(seconds).padStart(2, "0")}
          </div>
          <div className="timer-label">
            {isBreak ? "Break Time" : "Focus Time"}
          </div>
          <div className="timer-controls">
            <button
              className="icon-button"
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? <FiPause /> : <FiPlay />}
            </button>
            <button
              className="icon-button"
              onClick={() => {
                setShowSettings(true);
                setIsRunning(false);
              }}
            >
              <FiSettings />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Timer;
