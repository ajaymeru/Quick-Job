import React, { useEffect, useState } from 'react';
import "../../Styles/EmployerStatistics.scss";
import axios from 'axios';

const EmployerStatistics = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [data, setData] = useState({});
  const [counts, setCounts] = useState({
    totalJobsCount: 0,
    totalApplicantsCount: 0,
    activeJobsCount: 0,
    wishlistCount: 0,
    shortlistedCount: 0,
    selectedCount: 0,
    rejectedCount: 0,
    expiredjobs: 0,
    followers: 0,
    todayJobs: 0,
  });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token Found");
          return;
        }
        const response = await axios.get(`${SERVER_URL}api/employer/statistics`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchStatistics();
  }, []);

  useEffect(() => {
    if (data) {
      Object.keys(data).forEach((key) => {
        const targetValue = data[key];
        if (typeof targetValue === "number") {
          const duration = 1000; 
          const interval = 20; 
          const increment = targetValue / (duration / interval);

          let currentValue = 0;
          const intervalId = setInterval(() => {
            currentValue += increment;
            if (currentValue >= targetValue) {
              clearInterval(intervalId);
              currentValue = targetValue; 
            }
            setCounts((prevCounts) => ({
              ...prevCounts,
              [key]: Math.round(currentValue), 
            }));
          }, interval);
        }
      });
    }
  }, [data]);

  return (
    <div className='EmployerStatistics'>
      <div className="cards">
        <div className="card">
          <h5 className="card-title">Total Jobs</h5>
          <p className="card-text">{counts.totalJobsCount}</p>
        </div>
        <div className="card">
          <h5 className="card-title">Total Applicants</h5>
          <p className="card-text">{counts.totalApplicantsCount}</p>
        </div>
        <div className="card">
          <h5 className="card-title">Wishlist Applicants</h5>
          <p className="card-text">{counts.wishlistCount}</p>
        </div>
        <div className="card">
          <h5 className="card-title">Shortlisted Applicants</h5>
          <p className="card-text">{counts.shortlistedCount}</p>
        </div>
        <div className="card">
          <h5 className="card-title">Selected Applicants</h5>
          <p className="card-text">{counts.selectedCount}</p>
        </div>
        <div className="card">
          <h5 className="card-title">Rejected Applicants</h5>
          <p className="card-text">{counts.rejectedCount}</p>
        </div>
        <div className="card">
          <h5 className="card-title">Active Jobs</h5>
          <p className="card-text">{counts.activeJobsCount}</p>
        </div>
        <div className="card">
          <h5 className="card-title">Expired Jobs</h5>
          <p className="card-text">{counts.expiredjobs}</p>
        </div>
        <div className="card">
          <h5 className="card-title">Followers</h5>
          <p className="card-text">{counts.followers}</p>
        </div>
        <div className="card">
          <h5 className="card-title">Today Jobs</h5>
          <p className="card-text">{counts.todayJobs}</p>
        </div>
      </div>
    </div>
  );
};

export default EmployerStatistics;
