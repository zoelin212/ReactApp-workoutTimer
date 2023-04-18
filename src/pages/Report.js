import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../components/Header";
import WeeklyBarChart from "../components/WeeklyBarChart"
import MonthlyBarChart from "../components/MonthlyBarChart"
import Calories from '../components/Calories'

const Report = () => {
  const [totalTime, setTotalTime] = useState({
    today: "",
    week: "",
    month: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = localStorage.getItem("email");

        if (!email) {
          console.error("Email not found in localStorage");
          return;
        }

        // Get user's timezone
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

        const response = await axios.post(
          "https://www.zoelindev.com/timer/API/total.php",
          { email, timeZone }
        );

        if (response.data) {
          setTotalTime({
            today: response.data.todayTotal,
            week: response.data.weekTotal,
            month: response.data.monthTotal,
          });

          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="report">
      <Header />
      <div>
        <h2 className="totalTime">Total Time</h2>
        <div className="frame">
          <p>Today</p>
          <p>{totalTime.today}</p>
          <p>MM:SS</p>
        </div>
        <div className="frame">
          <p>This week</p>
          <p>{totalTime.week}</p>
          <p>HH:MM:SS</p>
        </div>
        <div className="frame">
          <p>This month</p>
          <p>{totalTime.month}</p>
          <p>HH:MM:SS</p>
        </div>
      </div>
      <Calories />
      <hr></hr>
      <h2 className="chartitle">Weekly Exercise Time</h2>
      <p className="note">X:mins, Y:day of week</p>
      <WeeklyBarChart/>

      <h2 className="chartitle">Monthly Exercise Time</h2>
      <p className="note">X:mins, Y:day of month</p>
      <MonthlyBarChart/>
    </div>
  );
};

export default Report;

