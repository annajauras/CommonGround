import { useState, useEffect } from "react";

const Countdown = ({ onCountdownEnd }) => {
  const timerStartTime = Date.now();
  const timerTarget = timerStartTime + 20000;

  const getTimeLeft = () => {
    const totalTimeLeft = timerTarget - Date.now();
    if (totalTimeLeft > 0) {
      const seconds = Math.floor((totalTimeLeft / 1000) % 60);
      return { seconds };
    } else return 0;
  };

  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft());
  useEffect(() => {
    const interval = setInterval(() => {
      const time = getTimeLeft();
      setTimeLeft(time);
      if (time.seconds === 0) {
        clearInterval(interval);
        if (onCountdownEnd) {
          onCountdownEnd();
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [onCountdownEnd]);

  return(
  <>
    
    <h2>{timeLeft.seconds}</h2>
  </>)
};

export default Countdown;
