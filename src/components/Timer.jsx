import React, { useState, useEffect } from "react";

export default function Timer() {
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [timerActive, setTimerActive] = useState(false);

  const getTimeRemaining = (endTime) => {
    const total = Date.parse(endTime) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return { total, hours, minutes, seconds };
  };

  useEffect(() => {
    let interval;
    if (timerActive && duration > 0) {
      const endTime = new Date(Date.now() + duration * 1000);
      interval = setInterval(() => {
        const remainingTime = getTimeRemaining(endTime);
        // If the timer has expired, stop the timer
        if (remainingTime.total <= 0) {
          clearInterval(interval);
          setTimerActive(false);
          setDuration(0);
        } else {
          setTime(remainingTime);
        }
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, duration]);

  const startTimer = (duration) => {
    setDuration(duration);
    setTimerActive(true);
  };

  const stopTimer = () => {
    setTimerActive(false);
    setDuration(0);
  };

  return (
    <>
      <div className="timer">
        {String(time.hours).padStart(2, "0")}:
        {String(time.minutes).padStart(2, "0")}:
        {String(time.seconds).padStart(2, "0")}
      </div>
      <div className="start">
        <button onClick={() => startTimer(1800)}>Start 30-min timer</button>
      </div>
      <div className="start">
        <button onClick={() => startTimer(3600)}>Start 1-hour timer</button>
      </div>
      <div className="start">
        <button onClick={stopTimer}>Stop Timer</button>
      </div>
    </>
  );
}