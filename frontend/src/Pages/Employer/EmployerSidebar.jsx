import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import "../../Styles/EmployerSidebar.scss";
import axios from 'axios';

const EmployerSidebar = ({ isOpen }) => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [user, setUser] = useState(null);
  const location = useLocation();
  const menuItems = [
    { text: 'Statistics', path: "/employer/statistics", icon: "📊" },
    { text: 'Post Job', path: "/employer/postjob", icon: "✍️" },
    { text: 'My Job Posts', path: "/employer/myjobposts", icon: "📋" },
    { text: 'Profile', path: "/employer/profile", icon: "👤" },
    { text: 'Search Candidates', path: "/employer/employees", icon: "👥" },
  ];

  useEffect(() => {
    const fetchMyDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }
        const response = await axios.get(`${SERVER_URL}api/employer/fetchmydetails`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        setUser(response.data.employer);
        console.log(response.data.employer);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMyDetails();
  }, []);

  return (
    <div className={`EmployerSidebar ${isOpen ? 'expanded' : 'collapsed'}`}>
      <div className="companylogo">
        {user && user.profileImage ? (
          <img
            src={user.profileImage}
            alt="Company Logo"
            style={{ width: "80%", borderRadius: "50%" }}
          />
        ) : (
          <img src="https://via.placeholder.com/100" alt="Company Logo" style={{ width: "80%", borderRadius: "50%" }} />
        )}
      </div>
      <div className="menuitems">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`menuitem ${location.pathname === item.path ? 'active' : ''}`}
          >
            <Link to={item.path}>
              <span className="icon">{item.icon}</span>
              {isOpen && <span className="text">{item.text}</span>}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployerSidebar;
