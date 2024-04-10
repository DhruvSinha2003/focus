import { useState } from "react";

export default function Timer() {
    const [time, setTime] = useState(0);
    if (time === 0) {
      return <button onClick={() => setTime(60)}>Start</button>;
    }
    return <div>{time}</div>;
}