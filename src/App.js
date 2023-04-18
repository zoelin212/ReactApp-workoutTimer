import './App.css';
import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Timer from './pages/Timer';
import Report from './pages/Report';

function App() {
  return (
    <div className="App">
      <Routes>
            <Route path="/" element={<Login />}/>
            <Route path="register" element={<Register />}/>
            <Route path="timer" element={<Timer />}/>
            <Route path="report" element={<Report />}/>
      </Routes>
    </div>
  );
}

export default App;
