import React from "react";
import './main.css';

const About = () => {
  return (
    <main className="about-page">
      <section className="about-hero">
        <h1>About Lami</h1>
        <p className="tagline">
          An AI Law Chatbot created by <strong>Shivanshu Prajapati</strong> — an extremely genius mind behind this project.
        </p>
      </section>

      <section className="about-content">
        <h2>What is Lami?</h2>
        <p>
          <strong>Lami</strong> is an AI-powered assistant designed to help you ask questions related to law.
          It aims to provide fast, helpful, and easy-to-understand guidance. This website and AI system were
          created by <strong>Shivanshu Prajapati</strong>.
        </p>

        <h3>What you can do here</h3>
        <ul>
          <li>Ask law-related questions in natural language.</li>
          <li>Get quick, AI-generated responses.</li>
          <li>Use voice input and listen to spoken answers.</li>
        </ul>

        <h3>Vision</h3>
        <p>
          Make legal information more accessible for everyone, anytime.
        </p>

        <h3>Note / Disclaimer</h3>
        <p className="disclaimer">
          Lami is an AI assistant and may make mistakes. It does not replace a licensed attorney.
          For serious legal matters, please consult a qualified professional.
        </p>

        <h3>Credits</h3>
        <p>
          Built by <strong>Shivanshu Prajapati</strong>. All rights reserved.
        </p>
      </section>

      <section className="about-cta">
        <a href="/login" className="btn">Login</a>
        <a href="/register" className="btn btn-secondary">Create an Account</a>
      </section>
    </main>
  );
};

export default About;
























