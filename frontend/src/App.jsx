import { useState } from 'react';
import './App.css';
import ChatBot from './components/upgrade/chatbot';
import Navbar from './components/Navbar';
import About from '../pages/About';
import Contact from '../pages/Contact';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Footer from '../pages/Footer';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <Router>
      <div className="app-container"> {/* 👈 full height flex container */}
        <Navbar />

        <div className="main-content"> {/* 👈 this will expand */}
          <Routes>
            <Route path="/" element={
              <ChatBot />
              } />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
}

export default App;






