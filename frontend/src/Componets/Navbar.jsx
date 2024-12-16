import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "../Styles/Navbar.scss";

const Navbar = () => {
  const token = localStorage.getItem("token");
  let role = null;

  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      role = decodedToken?.role?.toLowerCase();
      console.log(role);
    } catch (error) {
      console.error("Invalid token", error);
      localStorage.removeItem("token");
    }
  }

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleregisterclick = () => {
    setTimeout(() => {
      const registersection = document.getElementById('prehome-register');
      if (registersection) {
        registersection.scrollIntoView({ behavior: 'smooth', block: "start" });
      }
    }, 0);
  };

  const links = role === 'employee' ? [
    { path: "/", label: "Home" },
    { path: "/jobs", label: "Find Jobs" },
    { path: "/companies", label: "Companies" },
  ] : [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <div className="navbar">
      <div className="logo">
        <img src="logobg.png" alt="Quick Job Logo" />
        <div className="logo-title">
          <h2>Quick Job</h2>
          <p>Searching Made Easy</p>
        </div>
      </div>

      <div className="nav-links">
        {links.map((link) => (
          <Link key={link.path} to={link.path}>
            {link.label}
          </Link>
        ))}
      </div>

      <div className="nav-auth" style={{ display: role === 'employee' ? 'none' : 'flex' }}>
        <Link to="/login">Login</Link>
        <Link to="/#prehome-register" onClick={handleregisterclick}>Register</Link>
      </div>

      <div className="hamburger" onClick={toggleMenu} aria-label="Toggle navigation menu" role="button">
        <h3>☰</h3>
      </div>

      {isMenuOpen && (
        <div className="hamburger-list">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login" style={{ display: role === 'employee' ? 'none' : 'block' }}>Login</Link>
          <Link to="/#prehome-register" style={{ display: role === 'employee' ? 'none' : 'block' }} onClick={handleregisterclick}>Register</Link>
        </div>
      )}

      {role === 'employee' && (
        <div className="avatar-container">
          <div className="avatar" onClick={toggleDropdown} role="button" aria-label="Open avatar menu">
            <img src="avatar.png" alt="User" />
          </div>
          <div className={`dropdown-menu ${isDropdownOpen ? 'open' : ''}`}>
            <Link to="/profile">My Profile</Link>
            <Link to="/dashboard">Dashboard</Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.reload();
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
