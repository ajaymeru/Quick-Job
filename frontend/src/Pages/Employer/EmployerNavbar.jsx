import React, { useEffect, useState } from 'react';
import "../../Styles/EmployerNavbar.scss";
import { Divide as Hamburger } from 'hamburger-react';
import axios from 'axios';

const EmployerNavbar = ({ toggleSidebar, isSidebarOpen }) => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [user, setUser] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

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

  const handleLogoutClick = () => {
    setIsModalOpen(true); // Open the modal on logout click
  };

  const closeModal = () => {
    setIsModalOpen(false); // Close the modal without logging out
  };

  const confirmLogout = () => {
    logout(); // Proceed with logout when confirmed
    setIsModalOpen(false);
  };

  return (
    <div className="EmployerNavbar">
      <div className="hamburger">
        <Hamburger toggled={isSidebarOpen} toggle={toggleSidebar} size={24} />
      </div>

      <p>Welcome {user.companyname} </p>

      <button onClick={handleLogoutClick}>Logout</button>

      {/* Modal for logout confirmation */}
      <div className={`modal-overlay ${isModalOpen ? 'show' : ''}`}>
        <div className="modal">
          <h4>Are you sure you want to log out?</h4>
          <div className="modal-actions">
            <button className="btn-cancel" onClick={closeModal}>Cancel</button>
            <button className="btn-confirm" onClick={confirmLogout}>Confirm</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerNavbar;
