import React, { useEffect, useState } from "react";
import "../../Styles/FindOneJob.scss";
import { useParams } from "react-router-dom";
import axios from "axios";
import noprofile from "../../assets/notfound.png"
import location from "../../assets/location.png";
import { useNavigate } from "react-router-dom";

const FindOneJob = () => {
  const { id } = useParams();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [job, setJob] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [relatedJobs, setrelatedJobs] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }
        const url = `${SERVER_URL}api/employee/job/${id}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.data && response.data.job) {
          setJob(response.data.job);
          setrelatedJobs(response.data.relatedJobs)
          const userId = JSON.parse(atob(token.split(".")[1])).id;
          if (response.data.job.applicants.includes(userId)) {
            setIsApplied(true);
          }
        }
      } catch (error) {
        console.error("Error fetching job:", error.message);
      }
    };
    fetchJob();
  }, [id, SERVER_URL]);

  const handleApplyClick = () => {
    setShowPopup(true);
  };

  const confirmApply = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }
      const url = `${SERVER_URL}api/employee/apply/${id}`;
      const response = await axios.post(
        url,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setIsApplied(true);
        setShowPopup(false);
        alert("Job applied successfully!");
      }
    } catch (error) {
      console.error("Error applying for job:", error.message);
      alert("Error applying for job. Please try again.");
    }

  };
  const handlejobcardclick = (id) => {
    navigate(`/job/${id}`);
  };

  return (
    <div className="FindOneJob">

      <h2>Job Details</h2>

      {job ? (
        <div className="comapany-job">

          <div className="company">
            <div className="company-info">
              {job && job.employerId.profileImage ? (
                <img src={job.employerId.profileImage} alt="Company logo" />
              ) : (
                <img src={noprofile} alt="" />
              )}
              <div className="name-info">
                <h3>{job.employerId.companyname}</h3>
                <a href={job.employerId.website} target="_blank" rel="noopener noreferrer">View Web</a>
                <div className="location-industry">
                  <p>{job.employerId.city}</p>
                  <p>{job.employerId.industry}</p>
                </div>
              </div>
            </div>
            <p>
              {job.employerId.description.length > 100
                ? job.employerId.description.substring(0, 100) + "..."
                : job.employerId.description}
            </p>
          </div>

          <div className="job">
            <h1>{job.jobtitle}</h1>

            <div className="job-information">
              <div className="group">
                <h4>Employee Type:</h4>
                <p>{job.jobtype}</p>
              </div>
              <div className="group">
                <h4>Date posted:</h4>
                <p>{new Date(job.posteddate).toDateString()}</p>
              </div>
              <div className="group">
                <h4>Dead line:</h4>
                <p>{new Date(job.applicationdeadline).toDateString()}</p>
              </div>
              <div className="group">
                <h4>Experience Level:</h4>
                <p>{job.experiencelevel}</p>
              </div>
              <div className="group">
                <h4>Location:</h4>
                <p>{job.location}</p>
              </div>
              <div className="group">
                <h4>Salary</h4>
                <p>{job.salaryrange}</p>
              </div>
              <div className="group">
                <h4>Category:</h4>
                <p>{job.jobcategory}</p>
              </div>

            </div>

            <div className="job-information2">
              <div className="group">
                <h4>Job Description:</h4>
                <p>{job.jobdescription}</p>
              </div>

              <div className="group">
                <h4>Requirements:</h4>
                <ul>
                  {job.jobrequirements.map((requirement, index) => (
                    <li key={index}>{requirement}</li>
                  ))}
                </ul>
              </div>

              <div className="group">
                <h4>Responsibilities:</h4>
                <ul>
                  {job.jobresponsibilities.map((res, index) => (
                    <li key={index}>{res}</li>
                  ))}
                </ul>
              </div>

              <div className="group">
                <h4>Preffered Qualifications:</h4>
                <ul>
                  {job.preferredqualifications.map((res, index) => (
                    <li key={index}>{res}</li>
                  ))}
                </ul>
              </div>
            </div>

            {isApplied ? (
              <button className="applied-btn" disabled>
                Applied
              </button>
            ) : (
              <button className="apply-btn" onClick={handleApplyClick}>
                Apply Now
              </button>
            )}
          </div>
        </div>

      ) : (
        <p>Loading job details...</p>
      )}

      <div className="related-jobs">
        <h2>Related Jobs</h2>
        <div className="related-job-cards">
          {relatedJobs.length > 0 ? (
            relatedJobs.map((job, index) => (
              <div key={job._id} className="related-job-card">
                <div className="jobcardtop">
                  <div className="company-info">
                    {job && job.employerId.profileImage ? (
                      <img src={job.employerId.profileImage} alt="" />
                    ) : (
                      <img src={noprofile} alt="" />
                    )}
                    <h2>{job.employerId.companyname}</h2>
                  </div>
                  <div className="links-info">
                    <button onClick={() => handlejobcardclick(job._id)}>Apply</button>
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

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Are you sure you want to apply for this job?</p>
            <button onClick={confirmApply}>Confirm</button>
            <button onClick={() => setShowPopup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindOneJob;
