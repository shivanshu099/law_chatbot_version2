import React from "react";
import './main.css'



const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>
          © {new Date().getFullYear()} <strong>Lami</strong>. Built with ❤️ by{" "}
          <span className="highlight">Shivanshu Prajapati</span>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;









