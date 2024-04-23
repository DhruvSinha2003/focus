import React, { useState, useEffect } from "react";

export default function PomodoroTimer() {
  const [focusDuration, setFocusDuration] = useState(25 * 60); // 25 minutes in seconds
  const [breakDuration, setBreakDuration] = useState(5 * 60); // 5 minutes in seconds
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [timerActive, setTimerActive] = useState(false);
  const [isBreakTime, setIsBreakTime] = useState(false);

  const getTimeRemaining = (endTime) => {
    const total = Date.parse(endTime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return { total, hours, minutes, seconds };
  };

  useEffect(() => {
    let interval;
    if (timerActive) {
      const endTime = new Date(Date.now() + (isBreakTime ? breakDuration : focusDuration) * 1000);
      interval = setInterval(() => {
        const remainingTime = getTimeRemaining(endTime);
        if (remainingTime.total <= 0) {
          clearInterval(interval);
          setTimerActive(false);
          setIsBreakTime(!isBreakTime); // Toggle between focus and break time
          // Start the next session automatically
          setTimerActive(true);
        } else {
          setTime(remainingTime);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, focusDuration, breakDuration, isBreakTime]);

  const startTimer = () => {
    setTimerActive(true);
  };

  const stopTimer = () => {
    setTimerActive(false);
    setTime({ hours: 0, minutes: 0, seconds: 0 });
  };

  const handleFocusDurationChange = (event) => {
    const duration = parseInt(event.target.value, 10) * 60; // Convert minutes to seconds
    setFocusDuration(duration);
  };

  const handleBreakDurationChange = (event) => {
    const duration = parseInt(event.target.value, 10) * 60; // Convert minutes to seconds
    setBreakDuration(duration);
  };

  return (
    <>
      <h1>{timerActive ? (isBreakTime ? "Break" : "Focus Time") : "Pomodoro Timer"}</h1>
      <div className="timer">
        {String(time.hours).padStart(2, "0")}:
        {String(time.minutes).padStart(2, "0")}:
        {String(time.seconds).padStart(2, "0")}
      </div>
      <div>
        <label htmlFor="focusDuration">Focus Duration (minutes):</label>
        <input
          type="number"
          id="focusDuration"
          value={focusDuration / 60}
          onChange={handleFocusDurationChange}
        />
      </div>
      <div>
        <label htmlFor="breakDuration">Break Duration (minutes):</label>
        <input
          type="number"
          id="breakDuration"
          value={breakDuration / 60}
          onChange={handleBreakDurationChange}
        />
      </div>
      <div className="start">
        <button onClick={startTimer}>Start Timer</button>
      </div>
      <div className="stop">
        <button onClick={stopTimer}>Stop Timer</button>
      </div>
    </>
  );
}
