import React from 'react';
import "../../Styles/PreHome.scss";
import { Link } from 'react-router-dom';
import CommonHome from '../CommonHome/CommonHome';

const PreHome = () => {
  return (
    <div className="prehome">
      <div className="prehome-container">
        <CommonHome />
      </div>
      <div id="prehome-register" className="prehome-register">
        <h4>Let's Get Connected And Start Finding Your Dream Job</h4>

        <div className="cards">
          <div className="card">
            <Link to="/signup?role=employee">Employee</Link>
            <p>Register to grab your job</p>
          </div>
          <div className="card">
            <Link to="/signup?role=employer">Employer</Link>
            <p>Register to hire talented employees</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreHome;
