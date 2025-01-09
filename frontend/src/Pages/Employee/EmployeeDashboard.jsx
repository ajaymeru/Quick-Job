import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import EmployeeProfile from './EmployeeProfile';
import SavedJobs from './SavedJobs';
import ChangePassword from './ChangePassword';
import "../Styles/EmployeeDashboard.scss";
import CvBuilder from './CvBuilder';

const EmployeeDashboard = () => {
  return (
    <div className='employee-dashboard'>
      <div className="dashboard-sidebar">
        <Link to="/dashboard/profile">My Profile</Link>
        <Link to="/dashboard/saved-jobs">Saved Jobs</Link>
        <Link to="/dashboard/change-password">Change Password</Link>
        <Link to="/dashboard/cvbuilder">Cv Builder</Link>
      </div>
      <div className="dashboard-content">
        <Routes>
          <Route path="profile" element={<EmployeeProfile />} />
          <Route path="saved-jobs" element={<SavedJobs />} />
          <Route path="change-password" element={<ChangePassword />} />
          <Route path='cvbuilder' element={<CvBuilder />} />
        </Routes>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
