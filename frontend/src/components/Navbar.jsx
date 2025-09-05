import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  //check if user is logged in
  useEffect(()=>{
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);//true if token exits

  },[]);
  const handleLogout = () =>{
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/login");
  };
  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo">LamiChatbot</div>
        <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
          <li><Link to="/">Home </Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          {!isLoggedIn ? (
            <>
          <li><Link to="/login">login</Link></li>
          <li><Link to="/register">register</Link></li>
          </>
          ): (
            <li><button onClick={handleLogout} className='logout-btn' >Logout</button></li>
          )}
        </ul>
        <div className="hamburger" onClick={toggleMenu}>
          ☰
        </div>
      </div>
    </nav>
  );
};

export default Navbar;



