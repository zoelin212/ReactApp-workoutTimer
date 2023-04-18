import React, { useState } from 'react';

function Calories() {
  const [weight, setWeight] = useState('');
  const [activityType, setActivityType] = useState(1);
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const burnedCalories = parseFloat(weight) * parseFloat(activityType) * (parseFloat(duration) / 60);
    setCalories(burnedCalories);
  };

  return (
    <div className="calorie">
      <h2 className="totalTime">Calorie Calculator</h2>

      <form className="calForm" onSubmit={handleSubmit}>
      <p className='cal'>Burned Calories: {calories.toFixed(2)} kcal</p>

        <label htmlFor="weight">Weight (kg):</label>
        <input
          type="number"
          id="weight"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />
        <label htmlFor="activityType">Activity Type:</label>
        <select
          id="activityType"
          value={activityType}
          onChange={(e) => setActivityType(e.target.value)}
        >
          <option value="1">Sitting (working, watching TV, driving, eating, chatting)</option>
          <option value="2.5">Walking, housework, standing</option>
          <option value="4.5">Brisk walking, downhill, swimming, badminton, table tennis, volleyball, Tai Chi, dancing, cycling</option>
          <option value="6">Running, uphill, continuous fast swimming, fast stair climbing, aerobic dance, fast cycling, Taekwondo, rock climbing, rope jumping, intense ball games</option>
        </select>
        <label htmlFor="duration">Duration (minutes):</label>
        <input
          type="number"
          id="duration"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
        />
        <button className="go" type="submit">Calculate</button>
      </form>
    </div>
  );
}

export default Calories;
