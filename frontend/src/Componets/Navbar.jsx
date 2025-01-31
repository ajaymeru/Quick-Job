import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import "../Styles/Navbar.scss";
import logobg from "../assets/logobg.png";
import { getTokenAndRole } from "../utils/authUtils";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { token, role } = getTokenAndRole();
  const navigate = useNavigate();
  const location = useLocation(); 

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const handleregisterclick = () => {
    setTimeout(() => {
      const registersection = document.getElementById('prehome-register');
      if (registersection) {
        registersection.scrollIntoView({ behavior: 'smooth', block: "start" });
      }
    }, 0);
  };

  const employeeLinks = [
    { path: "/", label: "Home" },
    { path: "/jobs", label: "Find Jobs" },
    { path: "/companies", label: "Companies" },
    { path: "/dashboard/profile", label: "My Profile" },
    { path: "/dashboard/saved-jobs", label: "Saved Jobs" },
    { path: "/dashboard/cvbuilder", label: "Cv Builder" },
    { path: "#", label: "Logout", onclick: handleLogout },
  ];

  // Helper function to determine if the link is active
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <div className="navbar">
      <div className="logo">
        <img src={logobg} alt="Quick Job Logo" />
        <div className="logo-title">
          <h2>Quick Job</h2>
          <p>Searching Made Easy</p>
        </div>
      </div>

      <div className={`nav-links ${role === 'employee' ? 'visible' : 'hidden'}`}>
        {employeeLinks.slice(0, 3).map((link) => (
          <Link 
            key={link.path} 
            to={link.path} 
            className={isActive(link.path)} // Add active class if the link is active
          >
            {link.label}
          </Link>
        ))}
      </div>

      {!token && (
        <div className="nav-auth">
          <Link to="/authform">Signup/Login</Link>
        </div>
      )}

      {role === 'employee' && (
        <div className="avatar-container">
          <div className="avatar" onClick={() => setMenuOpen(!menuOpen)}>
            <img src="avatar.png" alt="User Avatar" />
          </div>
          <div className={`dropdown-menu ${menuOpen ? 'visible' : ''}`}>
            {employeeLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className="dropdown-item"
                onClick={link.onclick || (() => setMenuOpen(false))}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
