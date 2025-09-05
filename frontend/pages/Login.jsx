import React, { useState } from 'react'
import api from '../src/api'
import { useNavigate } from "react-router-dom";

import './main.css';



const Login = () => {
  const [username,setUsername] = useState("");
  const [password,setpassword]= useState("");
  const [error,seterror]=useState(null);
  const navigate = useNavigate();
  const handleLogin = async (e)=>{
    e.preventDefault();
    try{
      const res = await api.post("/login",{
        username,
        password,
      });
      localStorage.setItem("token",res.data.access_token);
      alert("✅ Login successfull");
      navigate("/");
    }
    catch(err){
      seterror(err.response?.data?.detail || "Login failed");
    }
  };


  return (
    <div>
      <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setpassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
    </div>
  )
}

export default Login
