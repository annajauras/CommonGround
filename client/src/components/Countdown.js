import { useState, useEffect } from "react";

const Countdown = ({ onCountdownEnd }) => {
  const timerStartTime = Date.now();
  //Sets starting time in milliseconds based on current date, so that all players have same tome left on countdown
  const timerTarget = timerStartTime + 15000;
  //Function that sets updates time
  const getTimeLeft = () => {
    const totalTimeLeft = timerTarget - Date.now();
    const seconds = Math.floor((totalTimeLeft / 1000) % 60);
    return totalTimeLeft > 0 ? seconds : 0;
  };
  //State variable of time left to be displayed
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      const time = getTimeLeft();
      setTimeLeft(time);

      // Updates the CSS variable `--timeLeft`
      document.documentElement.style.setProperty('--timeLeft', time);
      //Stops the countdown when time gets to 0
      if (time <= 0) {
        clearInterval(interval);//Clears interval to stop countdown
        //allows countdown end to be handled in other components
        if (onCountdownEnd) {
          onCountdownEnd();
        }
      }
    }, 100);
    //Cancels interval object created by setInterval() onCountdownEnd.
    return () => clearInterval(interval);
  }, [onCountdownEnd]);

  return (
    <div className="countdown-timer">
      <div className="timer-circle">
        <div className="time">{timeLeft}</div>
      </div>
    </div>
  );
};

export default Countdown;
