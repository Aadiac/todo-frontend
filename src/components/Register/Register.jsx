import React, { useState } from 'react'
import axios from "axios";
import "./Register.css"

import email_icon from "../Assets/gmail.png"
import password_icon from "../Assets/password.png"
import { useNavigate } from 'react-router-dom';

export const Register = () => {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [error,setError] = useState("");
    const navigate = useNavigate();

    const validateform = async() =>{
        
        if(!email.match(/\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/)){
            setError("Please enter a valid email adress");
            return false;
        }
        if(password.trim().length < 6){
            setError("Password must be atleast 6 charchters");
            return false;
        }
        console.log("Sending Data:", { "email-id":email,"password":password }); // Debugging
        setError("");
        try{
            const response = await axios.post(
                "http://localhost:4001/register",
                {"email":email,"password":password},
                {
                    headers:{
                        "Content-Type" :"application/json",
                    },
                    withCredentials:true,
                }
                );
            localStorage.setItem("email",email);
            navigate('/dashboard');
            alert("Registered Succesfully");
            console.log("API Response:", response.data);
        }catch (error) {
            if (error.response && error.response.status === 409){
                setError("Email Already registered, try to login !!!")
            }else if(error.response && error.response.status === 400){
                setError("Server Error (404) ")
            }else{
            setError(error.response?.data?.message || "Something went wrong.");
            }
            console.error("Error:", error);
        }

        
        return true;
    }
    

  return (
    <div className='container'>
        <div className='header'>
            <div className='text'>Register</div>
            <div className='underline'></div>
        </div>
        <div className='inputs'>
            
            <div className='input'>
                <img src={email_icon} alt='Email-icon'/>
                <input 
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className='input'>
                <img src={password_icon} alt='password-icon'/>
                <input 
                    type='password'
                    placeholder='*********'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
            </div>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="forget-password">Already Registered <span onClick={() => window.location.href="./login"}>click here</span></div>
        <div className="submit-container">
            <div className="submit" onClick={validateform}>Register</div>
            {/* <button className="submit" onClick={validateform}>Register</button> */}
            {/* <div className="submit" onClick={ ()=> window.location.href = "/Login"}>Login</div> */}
        </div>
    </div>
  )
}
