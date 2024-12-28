import React, { useState } from 'react';
import "../../Styles/Employer.scss";
import EmployerSidebar from './EmployerSidebar';
import EmployerNavbar from './EmployerNavbar';
import { Routes, Route, Navigate } from 'react-router-dom';
import EmployerStatistics from './EmployerStatistics';
import Postjob from './Postjob';
import MyJobPosts from './MyJobPosts';
import EmployerProfile from './EmployerProfile';
import ApplicantsByJob from './ApplicantsByJob';
import EditJobDetails from './EditJobDetails.JSX';

const Employer = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className='Employer'>
      <EmployerSidebar isOpen={isSidebarOpen} />
      <div className='EmployerContent'>
        <EmployerNavbar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <div className='EmployerMain'>
          <Routes>
            <Route path="/statistics" element={<EmployerStatistics />} />
            <Route path="/" element={<Navigate to="/employer/statistics" />} />
            <Route path="/postjob" element={<Postjob />} />
            <Route path="/myjobposts" element={<MyJobPosts />} />
            <Route path='/profile' element={<EmployerProfile />} />
            <Route path='/applicantsbyjob/:jobId' element={<ApplicantsByJob />} />
            <Route path='/editjob/:id' element={<EditJobDetails />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Employer;
