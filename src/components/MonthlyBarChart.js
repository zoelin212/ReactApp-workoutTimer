import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { startOfMonth, endOfMonth, getDaysInMonth } from "date-fns";

const MonthlyBarChart = () => {
  const [monthData, setMonthData] = useState({});
  const [email, setEmail] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const storedEmail = localStorage.getItem("email");
      if (!storedEmail) {
        console.error("Email not found in local storage");
        return;
      }

      setEmail(storedEmail);

      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      const result = await axios.post(
        "https://www.zoelindev.com/timer/API/bar.php",
        {
          email: storedEmail,
          timeZone,
        }
      );
      setMonthData(result.data.monthData);
    };

    fetchData();
  }, []);

  const timeZoneOffset = new Date().getTimezoneOffset() * 60000; // getTimezoneOffset returns minutes, convert to milliseconds
  const localDate = new Date(Date.now() - timeZoneOffset);

  const monthDataLabels = Array.from(Array(getDaysInMonth(localDate)), (_, i) =>
    (i + 1).toString()
  );
  const monthDataValues = Array.from(Array(getDaysInMonth(localDate)), (_, i) => {
    const date = new Date(localDate);
    date.setDate(i + 1);
    const formattedDate = date.toISOString().split("T")[0];
    const seconds = monthData[formattedDate] || 0;
    return Math.floor(seconds / 60); // turn seconds to mins
  });

  const monthChartData = {
    labels: monthDataLabels,
    datasets: [
      {
        label: "",
        data: monthDataValues,
        backgroundColor: monthDataValues.map((_, i) =>
          `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256
          )}, ${Math.floor(Math.random() * 256)}, 0.2)`
        ),
        borderColor: monthDataValues.map((_, i) =>
          `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(
            Math.random() * 256
          )}, ${Math.floor(Math.random() * 256)})`
        ),
        borderWidth: 1,
      },
    ],
  };

  const monthChartOptions = {
    legend: {
      display: false,
    },
    
  };

  return (
    <div>
      <Bar data={monthChartData} options={monthChartOptions}/>
    </div>
  );
};

export default MonthlyBarChart;
