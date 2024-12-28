import React, { useState, useEffect } from 'react';
import "../../Styles/Findjobs.scss";
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";

const Findjobs = () => {
  const { id } = useParams();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [jobType, setJobType] = useState('');
  const [city, setCity] = useState('');
  const [remote, setRemote] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(`${SERVER_URL}api/employee/jobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const fetchedJobs = response.data.jobs;
        setJobs(fetchedJobs);
        setFilteredJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const fetchEmployeeDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(`${SERVER_URL}api/employee/mydetails`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const employee = response.data.employee;
        setSavedJobs(employee.savejobs);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchJobs();
    fetchEmployeeDetails();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = jobs.filter((job) => {
        const matchesKeyword = searchKeyword === '' || job.jobtitle.toLowerCase().includes(searchKeyword.toLowerCase());
        const matchesJobType = jobType === '' || job.jobtype === jobType;
        const matchesCity = city === '' || job.location.toLowerCase().includes(city.toLowerCase());
        const matchesRemote = remote === '' || (remote === 'yes' ? job.location.toLowerCase() === 'remote' : job.location.toLowerCase() !== 'remote');
        const matchesExperience = experienceLevel === '' || job.experiencelevel.toLowerCase().includes(experienceLevel.toLowerCase());
        return matchesKeyword && matchesJobType && matchesCity && matchesRemote && matchesExperience;
      });

      setFilteredJobs(filtered);
    };

    applyFilters();
  }, [searchKeyword, jobType, city, remote, experienceLevel, jobs]);

  const handlejobcardclick = (id) => {
    navigate(`/job/${id}`);
  };

  const toggleSaveJob = async (jobId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      if (savedJobs.includes(jobId)) {
        await axios.post(`${SERVER_URL}api/employee/toggle-save/${jobId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedJobs(savedJobs.filter((id) => id !== jobId)); 
      } else {
        await axios.post(`${SERVER_URL}api/employee/toggle-save/${jobId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSavedJobs([...savedJobs, jobId]); 
      }
    } catch (error) {
      console.error("Error toggling save job:", error);
    }
  };


  return (
    <div className="Findjobs">
      <div className="heading">
        <h1>Find Jobs</h1>
      </div>
      <div className="search">
        <div className="filters">
          <div className="searchword">
            <input
              type="text"
              placeholder="Search by keyword, job title"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </div>
          <div className="experience">
            <input
              type="text"
              placeholder="Experience level (e.g., Entry-Level, Mid-Level)"
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
            />
          </div>
          <div className="jobtype">
            <select value={jobType} onChange={(e) => setJobType(e.target.value)}>
              <option value="">Select job type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div className="city">
            <input
              type="text"
              placeholder="City (e.g., Hyderabad, Remote)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="remote">
            <select value={remote} onChange={(e) => setRemote(e.target.value)}>
              <option value="">Select remote</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
        </div>
        <div className="jobs">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div className="jobcard" key={job._id}>
                <h2>{job.jobtitle}</h2>
                <p><strong>Category:</strong> {job.jobcategory}</p>
                <p><strong>Description:</strong> {job.jobdescription}</p>
                <p><strong>Type:</strong> {job.jobtype}</p>
                <p><strong>Location:</strong> {job.location}</p>
                <p><strong>Experience Level:</strong> {job.experiencelevel}</p>
                <p><strong>Salary:</strong> {job.salaryrange}</p>
                <div>
                  <button onClick={() => handlejobcardclick(job._id)}>Apply</button>
                  <FontAwesomeIcon
                    icon={savedJobs.includes(job._id) ? solidBookmark : regularBookmark}
                    onClick={() => toggleSaveJob(job._id)}
                  />
                </div>
              </div>
            ))
          ) : (
            <p>No jobs found matching the filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Findjobs;
