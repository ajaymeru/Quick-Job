import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import "../../Styles/ApplicantsByJob.scss";

const ApplicantsByJob = () => {
  const { jobId } = useParams();
  console.log("Job ID:", jobId); // Debugging the jobId
  
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [applicants, setApplicants] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!jobId) {
        setErrorMessage("Invalid job ID.");
        setLoading(false);
        return;
      }
      
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setErrorMessage("No token found. Please log in.");
          setLoading(false);
          return;
        }

        const response = await axios.get(`${SERVER_URL}api/employer/fetchapplicationsbyjob/${jobId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setApplicants(response.data.applications);
      } catch (error) {
        setErrorMessage(error.response?.data?.msg || "Error fetching applications");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className="ApplicantsByJob">
      <h2>Applicants for Job</h2>
      {applicants.length === 0 ? (
        <p>No applications yet for this job.</p>
      ) : (
        <table className="applicants-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Saved Jobs</th>
              <th>Following Employers</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map((applicant) => (
              <tr key={applicant._id}>
                <td>{applicant.firstname} {applicant.lastname}</td>
                <td>{applicant.email}</td>
                <td>{applicant.phone}</td>
                <td>{applicant.savejobs.join(', ')}</td>
                <td>{applicant.followingEmployer.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ApplicantsByJob;
