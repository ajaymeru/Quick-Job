import React, { useEffect, useState } from 'react';
import "../../Styles/EmployerNavbar.scss";
import { Divide as Hamburger } from 'hamburger-react';
import axios from 'axios';

const EmployerNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [user, setUser] = useState({});



  useEffect(() => {
    const fetchmydetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(`${SERVER_URL}api/employer/fetchmydetails`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const employer = response.data.employer;
        setUser(employer);
      } catch (error) {
        console.error("Error fetching employer details:", error.response?.data || error.message);
      }
    };
    fetchmydetails();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.reload();

  }

  return (
    <div className="EmployerNavbar">
      <div className="hamburger">
        <Hamburger toggled={isSidebarOpen} toggle={toggleSidebar} size={24} />
      </div>

      <p>Welcome {user.comapanyname } </p>

      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default EmployerNavbar;
