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
    x: window.innerWidth - 680,
    y: 24,
  });
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const componentWidth = 300;
  const componentHeight = 300;
  const playHeight = 250;

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = Math.max(
          0,
          Math.min(e.clientX - offset.x, window.innerWidth - componentWidth)
        );
        const newY = Math.max(
          0,
          Math.min(
            e.clientY - offset.y,
            window.innerHeight - (isRunning ? playHeight : componentHeight)
          )
        );
        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleSelectStart = (e) => {
      if (isDragging) {
        e.preventDefault();
      }
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("selectstart", handleSelectStart);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("selectstart", handleSelectStart);
    };
  }, [isDragging, offset, isRunning, playHeight, componentHeight]);

  const handleMouseDown = (e) => {
    if (
      e.target.tagName.toLowerCase() === "input" ||
      e.target.tagName.toLowerCase() === "button"
    ) {
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
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
        transform: `translate(${position.x}px, ${position.y}px)`,
        top: 0,
        left: 0,
        width: componentWidth,
        height: isRunning ? playHeight : componentHeight,
        cursor: isDragging ? "grabbing" : "grab",
        userSelect: "none",
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
              onChange={(e) => setFocusDuration(parseInt(e.target.value) || 1)}
              min="1"
            />
          </div>
          <div className="timer-inputs">
            <label>Break Duration (minutes)</label>
            <input
              type="number"
              value={breakDuration}
              onChange={(e) => setBreakDuration(parseInt(e.target.value) || 1)}
              min="1"
            />
          </div>
          <button
            className="timer-button"
            onClick={() => {
              setShowSettings(false);
              setTimeLeft(focusDuration * 60);
              setIsRunning(true);
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
