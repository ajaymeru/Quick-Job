import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../../Styles/MyJobPosts.scss";
import { Link, useNavigate } from 'react-router-dom';

const MyJobPosts = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("No token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${SERVER_URL}api/employer/fetchmyjobs`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setJobs(response.data.jobs);
      } catch (error) {
        setErrorMessage(error.response?.data?.msg || "Error fetching jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchMyJobs();
  }, []);

  const openDeleteModal = (jobId) => {
    setSelectedJobId(jobId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJobId(null);
  };

  const handleDeleteJob = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("No token found. Please log in.");
        return;
      }

      await axios.delete(`${SERVER_URL}api/employer/deletejob/${selectedJobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== selectedJobId));
      closeModal();
      alert("Job deleted successfully");
    } catch (error) {
      alert(error.response?.data?.msg || "Error deleting job");
    }
  };
  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className="MyJobPosts">
      <h2>My Job Posts</h2>
      {jobs.length === 0 ? (
        <p>No job posts available.</p>
      ) : (
        <table className="job-table">
          <thead>
            <tr>
              <th>Job Title</th>
              <th>Job Type</th>
              <th>Category</th>
              <th>Location</th>
              <th>Posted Date</th>
              <th>Application Deadline</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job.jobtitle}</td>
                <td>{job.jobtype}</td>
                <td>{job.jobcategory}</td>
                <td>{job.location.join(', ')}</td>
                <td>{new Date(job.posteddate).toLocaleDateString()}</td>
                <td>{new Date(job.applicationdeadline).toLocaleDateString()}</td>
                <td>
                  <Link to={`/employer/applicantsbyjob/${job._id}`}>
                    <button className="see-applicants-btn">See Applicants</button>
                  </Link>
                  <button
                    className="view-edit-btn"
                    onClick={() => navigate(`/employer/editjob/${job._id}`)}
                  >
                    View/Edit
                  </button>
                  <button
                    className="delete-job-btn"
                    onClick={() => openDeleteModal(job._id)}
                  >
                    Delete Job
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this job post?</p>
            <div className="modal-actions">
              <button onClick={handleDeleteJob} className="confirm-btn">
                Yes, Delete
              </button>
              <button onClick={closeModal} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyJobPosts;
