import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
//import "./register.css";
import { Link } from "react-router-dom";

const Register = () => {

    let history = useNavigate();

    const [newUser, setNewUser] = useState ({
        email:''
    })

    const handleChange = (e) => {
        setNewUser({...newUser, [e.target.name]: e.target.value});
        //console.log(newUser);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("submit works");

        const sendNewUser = {
            email:newUser.email,
        }
        console.log(sendNewUser);

        
        axios.post("https://www.zoelindev.com/timer/API/register.php" , JSON.stringify({ 
            "email": document.querySelector("#email").value,  
        })).then( (response) => { 
            if(response.data === 1) {
                alert('The Email has been registered.')
            }else { 
                alert('Get ready!')
                history(`/timer`);
                localStorage.setItem("email", newUser.email);
                const sessionEmail = localStorage.getItem("email");
                console.log(sessionEmail); 
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
                    value={newUser.email}
                    onChange={handleChange}
                    />
                    <input className="go" type="submit" value="Register"/>
                </form>

                <p className="last">Have an account?
                    <Link to="/">Login</Link>
                </p>
            </div>

            <div className="round2"></div>
        </div>
    );
}

export default Register;