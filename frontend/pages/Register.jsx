import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../src/api';
import './main.css';


const Register = () => {
  const [username,setusername]=useState("");
  const [password,setpassword]=useState("");
  const[error,seterror]= useState(null);
  const navigate=useNavigate();
  const handleRegister = async (e) =>{
    e.preventDefault();
    try{
      await api.post("/register",{
        username,password,
      });
      alert("✅ Registration successful! Please login.");
      navigate("/login");
    }catch(err){
      seterror(err.response?.data?.detail || "Registeration Failed");
    }
  };


  return (
    <div className='form-container'>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input 
        type='text'
        placeholder='Enter username'
        value={username}
        onChange={(e)=> setusername(e.target.value)}
        required
        />
        <input 
        type='password'
        placeholder='Enter password'
        value={password}
        onChange={(e)=> setpassword(e.target.value)}
        required
        />
        <button type='submit'>Register</button>
      </form>
      {error && <p className='error'>{error}</p>}
    </div>
  );
};

export default Register



















