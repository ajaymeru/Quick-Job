import React, { useState, useEffect } from "react";
import "../../Styles/Findjobs.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import notfound from "../../assets/notfound.png";
import location from "../../assets/location.png";

const Findjobs = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [selectedExperienceLevels, setSelectedExperienceLevels] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  const jobTypes = ["Full-time", "Part-time", "Contract", "Temporary", "Internship"]
  const experienceLevels = ["Internship", "Entry level", "Associate", "Mid-Senior level", "Director", "Executive"];

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
        console.log(fetchedJobs);

        setJobs(fetchedJobs);
        setFilteredJobs(fetchedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    const fetchCities = async () => {
      try {
        const response = await axios.post("https://countriesnow.space/api/v0.1/countries/cities", {
          country: "India",
        });
        const cityOptions = response.data.data.map((city) => ({
          value: city,
          label: city,
        }));
        cityOptions.push({ value: "Remote", label: "Remote" });
        setCities(cityOptions);
      } catch (error) {
        console.error("Error fetching cities:", error);
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
        setSavedJobs(response.data.employee.savejobs);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchJobs();
    fetchCities();
    fetchEmployeeDetails();
  }, []);

  useEffect(() => {
    const applyFilters = () => {
      const filtered = jobs.filter((job) => {
        const matchesKeyword =
          !searchKeyword || job.jobtitle.toLowerCase().includes(searchKeyword.toLowerCase());
        const matchesRequirements =
          !jobRequirements ||
          job.jobrequirements.join(", ").toLowerCase().includes(jobRequirements.toLowerCase());
        const matchesJobType =
          selectedJobTypes.length === 0 || selectedJobTypes.includes(job.jobtype);
        const matchesExperience =
          selectedExperienceLevels.length === 0 || selectedExperienceLevels.includes(job.experiencelevel);
        const matchesCity =
          selectedCities.length === 0 || selectedCities.some((city) => job.location.includes(city));

        return matchesKeyword && matchesRequirements && matchesJobType && matchesExperience && matchesCity;
      });

      setFilteredJobs(filtered);
    };


    applyFilters();
  }, [searchKeyword, jobRequirements, selectedJobTypes, selectedExperienceLevels, selectedCities, jobs]);

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
          headers: { Authorization: `Bearer ${token}` },
        });
        setSavedJobs(savedJobs.filter((id) => id !== jobId));
      } else {
        await axios.post(`${SERVER_URL}api/employee/toggle-save/${jobId}`, {}, {
          headers: { Authorization: `Bearer ${token}` },
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
          <div className="inputs">
            <input
              type="text"
              placeholder="Search by job title"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <input
              type="text"
              placeholder="eg., html, css, js"
              value={jobRequirements}
              onChange={(e) => setJobRequirements(e.target.value)}
            />
          </div>
          <div className="checkboxes">
          <div className="multi-select">
              <h4>Location</h4>
              <Select
                isMulti
                options={cities}
                value={selectedCities.map((city) => ({ value: city, label: city }))}
                onChange={(selectedOptions) =>
                  setSelectedCities(selectedOptions ? selectedOptions.map((option) => option.value) : [])
                }
                placeholder="Select cities or Remote"
              />
            </div>
            <div className="checkbox-group">
              <h4>Job Type</h4>
              {jobTypes.map((type, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    value={type}
                    checked={selectedJobTypes.includes(type)}
                    onChange={(e) =>
                      setSelectedJobTypes((prev) =>
                        e.target.checked ? [...prev, type] : prev.filter((t) => t !== type)
                      )
                    }
                  />
                  {type}
                </label>
              ))}
            </div>
            <div className="checkbox-group">
              <h4>Experience Level</h4>
              {experienceLevels.map((level, index) => (
                <label key={index}>
                  <input
                    type="checkbox"
                    value={level}
                    checked={selectedExperienceLevels.includes(level)}
                    onChange={(e) =>
                      setSelectedExperienceLevels((prev) =>
                        e.target.checked ? [...prev, level] : prev.filter((l) => l !== level)
                      )
                    }
                  />
                  {level}
                </label>
              ))}
            </div>

          </div>

        </div>
        <div className="jobs">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <div className="jobcard" key={job._id}>
                <div className="jobcardtop">
                  <div className="company-info">
                    {job && job.employerId.profileImage ? (
                      <img src={job.employerId.profileImage} alt="" />
                    ) : (
                      <img src={notfound} alt="" />
                    )}
                    <h2>{job.employerId.companyname}</h2>
                  </div>
                  <div className="links-info">
                    <button onClick={() => handlejobcardclick(job._id)}>Apply</button>
                    <FontAwesomeIcon
                      icon={savedJobs.includes(job._id) ? solidBookmark : regularBookmark}
                      onClick={() => toggleSaveJob(job._id)}
                    />
                  </div>
                </div>

                <div className="jobcardbottom">
                  <h2>{job.jobtitle}</h2>
                  <div className="job-info">
                    <p>{job.jobtype}</p>

                    {Array.isArray(job.location)
                      ? job.location.map((city, index) => <p key={index}><img src={location} alt="" />{city}</p>)
                      : <p><img src={location} alt="" />{job.location}</p>
                    }

                    <p>{job.experiencelevel}</p>
                    <p>{job.salaryrange}</p>
                  </div>
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
