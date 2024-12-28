import React, { useEffect, useState } from "react";
import "../../Styles/FindOneJob.scss";
import { useParams } from "react-router-dom";
import axios from "axios";

const FindOneJob = () => {
  const { id } = useParams();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [job, setJob] = useState(null);
  const [isApplied, setIsApplied] = useState(false); 
  const [showPopup, setShowPopup] = useState(false); 

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

  return (
    <div className="FindOneJob">
      {job ? (
        <div className="job-details">
          <h1>{job.jobtitle}</h1>
          <p>
            <strong>Category:</strong> {job.jobcategory}
          </p>
          <p>
            <strong>Description:</strong> {job.jobdescription}
          </p>
          <p>
            <strong>Requirements:</strong> {job.jobrequirements}
          </p>
          <p>
            <strong>Responsibilities:</strong> {job.jobresponsibilities}
          </p>
          <p>
            <strong>Salary:</strong> {job.salaryrange}
          </p>
          <p>
            <strong>Experience Level:</strong> {job.experiencelevel}
          </p>
          <p>
            <strong>Location:</strong> {job.location}
          </p>
          <p>
            <strong>Application Deadline:</strong>{" "}
            {new Date(job.applicationdeadline).toDateString()}
          </p>

          {isApplied ? (
            <button className="applied-btn" disabled>
              Applied
            </button>
          ) : (
            <button className="apply-btn" onClick={handleApplyClick}>
              Apply
            </button>
          )}

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
      ) : (
        <p>Loading job details...</p>
      )}
    </div>
  );
};

export default FindOneJob;
