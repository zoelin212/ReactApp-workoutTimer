import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { getWeek, startOfWeek } from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";


const WeeklyBarChart = () => {
  const [weekData, setWeekData] = useState({});
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const storedEmail = localStorage.getItem("email");
      if (!storedEmail) {
        console.error("Email not found in local storage");
        return;
      }

      setEmail(storedEmail);

      const result = await axios.post(
        "https://www.zoelindev.com/timer/API/bar.php",
        {
          email: storedEmail,
        }
      );
      setWeekData(result.data.weekData);
    };

    fetchData();
  }, []);

  const weekDataLabels = [
    "S",
    "M",
    "T",
    "W",
    "T",
    "F",
    "S",
  ];

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const currentDate = new Date();
  const zonedDate = utcToZonedTime(currentDate, timeZone);
  const currentWeek = getWeek(zonedDate);
  const weekStartDate = startOfWeek(zonedDate);


  const weekDataValues = Array.from(Array(7), (_, i) => {
    const date = new Date(weekStartDate);
    date.setDate(date.getDate() + i);
    const formattedDate = date.toISOString().split("T")[0];
    return parseFloat((weekData[formattedDate] || 0) / 60).toFixed(1); // turn seconds to mins
  });
  

  const weekChartData = {
    labels: weekDataLabels,
    datasets: [
      {
        label: "null",
        data: weekDataValues,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const weekChartOptions = {
    legend: {
      display: false,
    },
    
  };

  return (
      <div>
        <Bar data={weekChartData} options={weekChartOptions}/>
      </div>
    
  );
};

export default WeeklyBarChart;
