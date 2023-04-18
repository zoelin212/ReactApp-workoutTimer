import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDumbbell,
  faCirclePlay,
  faCirclePause,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";

const Timer = () => {
  const [workTime, setWorkTime] = useState({ minutes: 0, seconds: 0 });
  const [restTime, setRestTime] = useState({ minutes: 0, seconds: 0 });
  const [sets, setSets] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isRest, setIsRest] = useState(false);

  const [workTimeSetting, setWorkTimeSetting] = useState({ minutes: 0, seconds: 0 });
  const [restTimeSetting, setRestTimeSetting] = useState({ minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!isRunning) return;
    const timerId = setInterval(() => {
      handleTick();
    }, 1000);
    return () => clearInterval(timerId);
  }, [isRunning, isRest, workTime, restTime]);

  const handleWorkTime = (minutes, seconds) => {
    const totalSeconds = minutes * 60 + seconds;
    setWorkTimeSetting({ minutes: Math.floor(totalSeconds / 60), seconds: totalSeconds % 60 });
  };

  const handleRestTime = (minutes, seconds) => {
    const totalSeconds = minutes * 60 + seconds;
    setRestTimeSetting({ minutes: Math.floor(totalSeconds / 60), seconds: totalSeconds % 60 });
  };

  const handleSets = (num) => {
    setSets(num);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentSet(1);
    setIsRest(false);
    setWorkTime({ minutes: 0, seconds: 0 });
    setRestTime({ minutes: 0, seconds: 0 });
  };

  const handleStart = () => {
    setIsRunning(true);
    if (isRest) {
      setRestTime({ minutes: restTimeSetting.minutes, seconds: restTimeSetting.seconds });
    } else {
      setWorkTime({ minutes: workTimeSetting.minutes, seconds: workTimeSetting.seconds });
    }
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleTick = () => {
    if (isRest) {
      if (restTime.minutes === 0 && restTime.seconds === 0) {
        if (currentSet === sets) {
          setIsRunning(false);
          setCurrentSet(1);
          setIsRest(false);
          setWorkTime({ minutes: workTimeSetting.minutes, seconds: workTimeSetting.seconds });
        } else {
          setCurrentSet(currentSet + 1);
          setIsRest(false);
          setWorkTime({ minutes: workTimeSetting.minutes, seconds: workTimeSetting.seconds });
        }
      } else if (restTime.seconds === 0) {
        setRestTime({ minutes: restTime.minutes - 1, seconds: 59 });
      } else {
        setRestTime({ ...restTime, seconds: restTime.seconds - 1 });
      }
    } else {
      if (workTime.minutes === 0 && workTime.seconds === 0) {
        setIsRest(true);
        setRestTime({ minutes: restTimeSetting.minutes, seconds: restTimeSetting.seconds });
    } else if (workTime.seconds === 0) {
      setWorkTime({ minutes: workTime.minutes - 1, seconds: 59 });
    } else {
      setWorkTime({ ...workTime, seconds: workTime.seconds - 1 });
    }
  }
};

const formatTime = (timeObj) => {
  const { minutes, seconds } = timeObj;
  const formattedMinutes = minutes.toString().padStart(2, "0");
  const formattedSeconds = seconds.toString().padStart(2, "0");
  return `${formattedMinutes}:${formattedSeconds}`;
};

return (
  <div className="timerPage">
    <div className="timer">
      <div className="timeDisplay">{formatTime(isRest ? restTime : workTime)}</div>
      <FontAwesomeIcon icon={faDumbbell} />
      <div className="current">{isRest ? "Rest" : "Work"}</div>
      <div className="setsDisplay">{`Set ${currentSet} of ${sets}`}</div>
      <div className="controlButtons">
        {isRunning ? (
          <FontAwesomeIcon icon={faCirclePause} onClick={handlePause} />
        ) : (
          <FontAwesomeIcon icon={faCirclePlay} onClick={handleStart} />
        )}
        <FontAwesomeIcon icon={faRotateLeft} onClick={handleReset} />
      </div>
    </div>
    <div className="settings">
                <div className="workTime">
                    <label>Work</label>

                    
                    <input type="number" min="0" max="60" 
                      value={workTimeSetting.minutes}
                      onChange={(e) => {
                          const time = parseInt(e.target.value, 10);
                          handleWorkTime(time, workTimeSetting.seconds);
                      }} 
                      disabled={isRunning}
                    />

                    <input type="number" min="0" max="59" 
                      value={workTimeSetting.seconds}
                      onChange={(e) => {
                          const time = parseInt(e.target.value, 10);
                          handleWorkTime(workTimeSetting.minutes, time);
                      }} 
                      disabled={isRunning}
                    />


                </div>
                <div className="restTime">
                    <label>Rest</label>

                    
                    <input type="number" min="0" max="60"
                      value={restTimeSetting.minutes}
                      onChange={(e) => {
                          const time = parseInt(e.target.value, 10);
                          handleRestTime(time, restTimeSetting.seconds);
                      }} 
                      disabled={isRunning}
                    />

                    <input type="number" min="0" max="59" 
                      value={restTimeSetting.seconds}
                      onChange={(e) => {
                          const time = parseInt(e.target.value, 10);
                          handleRestTime(restTimeSetting.minutes, time);
                      }} 
                      disabled={isRunning}
                    />

                </div>
                <div className="sets">
                    <label>Sets</label>

                    <input type="number"
                        min="1"
                        max="20"
                        value={sets}
                        onChange={(e) => {
                            const num = parseInt(e.target.value, 10);
                            handleSets(num);
                        }} />
                </div>
              </div>
  </div>
);
};

export default Timer;


