import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
//import "./login.css";

const Login = () => {
    let history = useNavigate();

    const [logInUser, setLogInUser] = useState ({
      email:'',
    })

    const handleChange = (e) => {
      setLogInUser({...logInUser, [e.target.name]: e.target.value});
      //console.log(logInUser);
    }

    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("submit works");

      const sendLogInUser = {
          email:logInUser.email,
      }
      console.log(sendLogInUser);

      axios.post("https://www.zoelindev.com/timer/API/login.php" , JSON.stringify({ 
            "email": document.querySelector("#email").value,  
        })).then( (response) => { 
            if(response.data === 1) {
              // Store email in local storage
              localStorage.setItem("email", logInUser.email);
              const sessionEmail = localStorage.getItem("email");
              console.log(sessionEmail); 
              alert('Welcome back!');
              history(`/timer`);
            }else {
              console.log(response.data); 
              alert('Invalid email.');
            }
        }).catch( error => { 
            console.log(error); 
        })
    }

    return(
        <div className="userPage">

            <div className="round"></div>

            <div className="userMid">
                <img src="./images/logo.svg" alt="Logo" className="logo"/>
              

                <form className="emailForm" onSubmit={handleSubmit}>
                    <input 
                    type="email" 
                    id="email" 
                    className="email" 
                    name="email"
                    aria-label="Email" placeholder="Email" 
                    required 
                    value={logInUser.email}
                    onChange={handleChange}
                    />
                    <input className="go" type="submit" value="Login"/>
                </form>

                <p className="last">New here? 
                    <Link to="/register">Register</Link>
                </p>
            </div>
            <div className="round2"></div>
      </div>
    );
}
export default Login;