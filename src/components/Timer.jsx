import { useState, useRef, useEffect } from "react";

export default function Timer() {
  const Ref = useRef(null);
  const [duration, setDuration] = useState(0);
  const [time, setTime] = useState("00:00:00");
  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total/1000)%60);
    const minutes = Math.floor((total/1000/60)%60);
    const hours = Math.floor((total/1000/60/60)%24);
    return{total,hours,minutes,seconds};
  }
}
