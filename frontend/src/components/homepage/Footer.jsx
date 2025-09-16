import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-section">
          <h2 className="footer-logo">
            <span style={{ color: '#3b82f6' }}>YY</span>
            <span style={{ color: '#ef4444' }}>News</span>
          </h2>
          <p>
            Reliable and up-to-date. Follow current events, 
            read our analysis and make the latest transactions around the world.
          </p>
          <div className="footer-icons">
            <i className="fa-brands fa-twitter"></i>
            <i className="fa-brands fa-facebook"></i>
            <i className="fa-brands fa-instagram"></i>
            <i className="fa-brands fa-github"></i>
          </div>
        </div>

        <div className="footer-section">
          <h4>Categories</h4>
          <ul>
            <li>Agenda</li>
            <li>Technology</li>
            <li>Health</li>
            <li>Sports</li>
            <li>Science</li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li>About Us</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Contact Us</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 YYHaber. All rights reserved.</p>
        <p>📧 YYNews@gmail.com</p>
      </div>
    </footer>
  );
}

export default Footer;
