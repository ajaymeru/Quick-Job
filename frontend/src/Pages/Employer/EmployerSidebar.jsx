import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import "../../Styles/EmployerSidebar.scss";

const EmployerSidebar = ({ isOpen }) => {
  const location = useLocation();
  const menuItems = [
    { text: 'Statistics', path: "/employer/statistics", icon: "📊" },
    { text: 'Post Job', path: "/employer/postjob", icon: "✍️" },
    { text: 'My Job Posts', path: "/employer/myjobposts", icon: "📋" },
    { text: 'Profile', path: "/employer/profile", icon: "👤" }
  ];

  return (
    <div className={`EmployerSidebar ${isOpen ? 'expanded' : 'collapsed'}`}>
      <div className="companylogo">
        {isOpen ? (
          <img
            src="https://as2.ftcdn.net/v2/jpg/07/91/22/59/1000_F_791225927_caRPPH99D6D1iFonkCRmCGzkJPf36QDw.jpg"
            alt="Company Logo"
            style={{ width: "100px" }}
          />
        ) : (
          <img
            src="https://as2.ftcdn.net/v2/jpg/07/91/22/59/1000_F_791225927_caRPPH99D6D1iFonkCRmCGzkJPf36QDw.jpg"
            alt="Logo"
            style={{ width: "50px" }}
          />
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
