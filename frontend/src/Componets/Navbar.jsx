import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../Styles/Navbar.scss";
import logobg from "../assets/logobg.png";
import { getTokenAndRole } from "../utils/authUtils";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { token, role } = getTokenAndRole();
  const navigate = useNavigate();

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
    { path: "/dashboard/change-password", label: "Change Password" },
    { path: "/dashboard/cvbuilder", label: "Cv Builder" },
    { path: "#", label: "Logout", onclick: handleLogout },
  ];

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
          <Link key={link.path} to={link.path}>{link.label}</Link>
        ))}
      </div>

      {!token && (
        <div className="nav-auth">
          <Link to="/login">Login</Link>
          <Link to="/#prehome-register" onClick={handleregisterclick}>Register</Link>
        </div>
      )}

      {role === 'employee' && (
        <div className="avatar-container">
          <div className="avatar" onClick={() => setMenuOpen(!menuOpen)}>
            <img src="avatar.png" alt="User Avatar" />
          </div>
          {menuOpen && (
            <div className="dropdown-menu">
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
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
