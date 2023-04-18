import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDumbbell,
  faCirclePlay,
  faCirclePause,
  faRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import Header from '../components/Header';

//API
const saveToDatabase = async (date, total, email) => {
  try {
    const response = await axios.post("https://www.zoelindev.com/timer/API/count.php", {
      date,
      total,
      email
    });

    console.log(response.data);
  } catch (error) {
    console.error("Error saving to database:", error);
  }
};

const Timer = () => {
  const [workTime, setWorkTime] = useState({ minutes: 0, seconds: 0 });
  const [restTime, setRestTime] = useState({ minutes: 0, seconds: 0 });
  const [sets, setSets] = useState(1);
  const [currentSet, setCurrentSet] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isRest, setIsRest] = useState(false);

  //fix moving num in input
  const [workTimeSetting, setWorkTimeSetting] = useState({ minutes: 0, seconds: 0 });
  const [restTimeSetting, setRestTimeSetting] = useState({ minutes: 0, seconds: 0 });

  // Add accumulatedTime state
  const [accumulatedTime, setAccumulatedTime] = useState(0);

  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60000;
  const localISOTime = new Date(now - timezoneOffset).toISOString().slice(0, 10);

  // Save accumulatedTime to the database
  const saveAccumulatedTime = async () => {
    if (accumulatedTime > 0) {
      const now = new Date();
      const timezoneOffset = now.getTimezoneOffset() * 60000;
      const localISOTime = new Date(now - timezoneOffset).toISOString().slice(0, 10);
      const total = accumulatedTime;
      const email = localStorage.getItem("email");
      await saveToDatabase(localISOTime, total, email);
      setAccumulatedTime(0);
    }
  };
  


  useEffect(() => {
    if (!isRunning) return;
    const timerId = setInterval(() => {
      handleTick();
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
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
    if (num === 0) {
      setSets("NAH");
    } else {
      setSets(num);
    }
  };

  const handleReset = async () => {
    setIsRunning(false);
    setCurrentSet(1);
    setIsRest(false);

    //let timer back to user setting
    // setWorkTime({ minutes: workTimeSetting.minutes, seconds: workTimeSetting.seconds });
    // setRestTime({ minutes: restTimeSetting.minutes, seconds: restTimeSetting.seconds });

    //let timer back to 0
    setWorkTime({ minutes: 0, seconds: 0 });
    setRestTime({ minutes: 0, seconds: 0 });

    // Save accumulatedTime to the database before resetting
    await saveAccumulatedTime();
  };

  const handleStart = () => {
    if (sets !== "NAH" && sets > 0) {
      const goAudio = document.getElementById("goAudio");
      const biAudio = document.getElementById("biAudio");

      goAudio.play();

      goAudio.addEventListener("ended", () => {
        biAudio.play();
      });
      setIsRunning(true);
      if (isRest) {
        setRestTime({ minutes: restTimeSetting.minutes, seconds: restTimeSetting.seconds });
      } else {
        setWorkTime({ minutes: workTimeSetting.minutes, seconds: workTimeSetting.seconds });
      }
    }
  };


  const handlePause = async () => {
    setIsRunning(false);
    await saveAccumulatedTime();
  };


  const handleTick = () => {
    if (isRest) {
      if (restTime.minutes === 0 && restTime.seconds === 0) {
        document.getElementById("biAudio").play();
        if (currentSet === sets) {
          setIsRunning(false);
          setCurrentSet(1);
          setIsRest(false);
          setWorkTime({ minutes: workTimeSetting.minutes, seconds: workTimeSetting.seconds });
          // 在完成所有组后保存累积时间
          saveAccumulatedTime();
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
        document.getElementById("biAudio").play();
        setIsRest(true);
        setRestTime({ minutes: restTimeSetting.minutes, seconds: restTimeSetting.seconds });
      } else if (workTime.seconds === 0) {
        setWorkTime({ minutes: workTime.minutes - 1, seconds: 59 });
      } else {
        setWorkTime({ ...workTime, seconds: workTime.seconds - 1 });
      }
    }
    // Increment accumulatedTime when the timer is running
    setAccumulatedTime((prev) => prev + 1);
    console.log(accumulatedTime);
  };

  const formatTime = (timeObj) => {
    const { minutes, seconds } = timeObj;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };

  const handleKeyPress = (e) => {
    const keyCode = e.keyCode || e.which;
    const keyValue = String.fromCharCode(keyCode);
    const regex = /^\d$/; // Only allow digits

    if (!regex.test(keyValue) && keyCode !== 8 && keyCode !== 13 && keyCode !== 37 && keyCode !== 39) {
      e.preventDefault();
    }
  };

  const color = isRest ? "var(--blue)" : "var(--orange)";

  return (
    <div className="timerPage">
      <Header />
      <audio id="goAudio" src="./mp3/go.mp3" preload="auto" />
      <audio id="biAudio" src="./mp3/bi.mp3" preload="auto" />

      <div className="timer">
        <div className="colorChange" style={{ backgroundColor: color }}>
          <div className="timeDisplay">{formatTime(isRest ? restTime : workTime)}</div>
          <div className="current">{isRest ? "- Rest -" : "- Work -"}</div>
        </div>
        <FontAwesomeIcon icon={faDumbbell} />
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

          <div>
            <input type="text"
              maxLength="2"
              pattern="\d*"
              value={workTimeSetting.minutes}
              onChange={(e) => {
                const time = parseInt(e.target.value, 10) || 0;
                handleWorkTime(time, workTimeSetting.seconds);
              }}
              onKeyDown={handleKeyPress}
              onClick={(e) => {
                if (e.target.value === "00" || e.target.value === "0") {
                  e.target.value = "";
                }
              }}
              onBlur={(e) => {
                if (e.target.value === "") {
                  e.target.value = "0";
                }
              }}
              disabled={isRunning}
            />
            <span>:</span>
            <input type="text"
              maxLength="2"
              pattern="\d*"
              value={workTimeSetting.seconds}
              onChange={(e) => {
                const time = parseInt(e.target.value, 10) || 0;
                handleWorkTime(workTimeSetting.minutes, time);
              }}
              onKeyDown={handleKeyPress}
              onClick={(e) => {
                if (e.target.value === "00" || e.target.value === "0") {
                  e.target.value = "";
                }
              }}
              onBlur={(e) => {
                if (e.target.value === "") {
                  e.target.value = "0";
                }
              }}
              disabled={isRunning}
            />
          </div>

        </div>
        <div className="restTime">
          <label>Rest</label>

          <div>
          <input type="text"
            maxLength="2"
            pattern="\d*"
            value={restTimeSetting.minutes}
            onChange={(e) => {
              const time = parseInt(e.target.value, 10) || 0;
              handleRestTime(time, restTimeSetting.seconds);
            }}
            onKeyDown={handleKeyPress}
            onClick={(e) => {
              if (e.target.value === "00" || e.target.value === "0") {
                e.target.value = "";
              }
            }}
            onBlur={(e) => {
              if (e.target.value === "") {
                e.target.value = "0";
              }
            }}
            disabled={isRunning}
          />
          <span>:</span>
          <input type="text"
            maxLength="2"
            pattern="\d*"
            value={restTimeSetting.seconds}
            onChange={(e) => {
              const time = parseInt(e.target.value, 10) || 0;
              handleRestTime(restTimeSetting.minutes, time);
            }}
            onKeyDown={handleKeyPress}
            onClick={(e) => {
              if (e.target.value === "00" || e.target.value === "0") {
                e.target.value = "";
              }
            }}
            onBlur={(e) => {
              if (e.target.value === "") {
                e.target.value = "0";
              }
            }}
            disabled={isRunning}
          />
          </div>

        </div>
        <div className="sets">
          <label>Sets</label>

          <div>
            <span>x</span>
            <input 
              className="setNum"
              type="number"
              min="0"
              max="20"
              value={sets}
              onChange={(e) => {
                const num = parseInt(e.target.value, 10);
                handleSets(num);
              }}
              onClick={(e) => {
                if (e.target.value === "00" || e.target.value === "0") {
                  e.target.value = "";
                }
              }}
              onBlur={(e) => {
                if (e.target.value === "") {
                  e.target.value = "1";
                  handleSets("1");
                }
              }}
              onKeyDown={handleKeyPress}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timer;


