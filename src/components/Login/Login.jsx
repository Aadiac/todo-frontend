import React, { useState } from 'react'
import axios  from 'axios'
import "../Register/Register.css"

import email_icon from "../Assets/gmail.png"
import password_icon from "../Assets/password.png"
import { useNavigate } from 'react-router-dom'

export const Login = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const [success,setSuccess] = useState("");
    const navigate = useNavigate();

    const validateform = async() =>{
        setError("")
        setSuccess("")
        if (!email.match(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)){
            setError("Please Enter a Valid email address");
            return false;
        }
        if (password.trim().length <6){
            setError("Password must be atleast 6 characters")
            return false
        }

        try{
            const response = await axios.post(
                "http://localhost:4001/login",
                {email,password},
                {
                    headers:{
                        "Content-Type" :"application/json",
                    },
                    withCredentials:true,
                }
            );
            setSuccess("Login succesfully");
            localStorage.setItem("email",email);
            navigate("/dashboard")
            alert("Login Succesfully");
            console.log("API Response:", response.data);

        }catch(error){
            if(error.response && error.response.status === 401){
                setError(error.response?.data?.message ||"Invalid Email Or Password!")
            }else if (error.response && error.response.status === 404){
                setError(error.response?.data?.message || "User Not Found")
            }else{
                setError(error.response?.data?.message || "something went wrong") 
            }
        }
    }

  return (
    <div className="container">
        <div className="header">
            <div className="text">Login</div>
            <div className="underline"></div>
        </div>
        <div className="inputs">
            <div className="input">
                <img src={email_icon} alt='email'/>
                <input 
                type='email' 
                placeholder="email"
                value ={email}
                onChange={(e) => setEmail(e.target.value)} 
                />
            </div>
            <div className="input">
                <img src={password_icon} alt='Password'/>
                <input 
                    type='password'
                    value={password}
                    placeholder='********'
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            {error && <div className="error-message">{error}</div>}
            {success &&  <div className="success-message">{success}</div>}

            <div className="forget-password">Not Registered <span onClick={() => window.location.href="/" }>click here</span></div>
            <div className="submit-container">
                <div className="submit" onClick={validateform}>Login</div>
                {/* <div className="submit" onClick={() => window.location.href="/"}>Register</div> */}
            </div>
        </div>
    </div>
  )
}
