import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../Styles/ApplicantsByJob.scss";

const ApplicantsByJob = () => {
  const { jobId } = useParams();
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const [applicants, setApplicants] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [shortlisted, setShortlisted] = useState([]);
  const [selected, setSelected] = useState([]);
  const [rejected, setRejected] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch Applications
  const fetchApplications = async () => {
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

      const response = await axios.get(
        `${SERVER_URL}api/employer/fetchapplicationsbyjob/${jobId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const { applicants, wishlist, shortlisted, selected, rejected } =
        response.data.applications;

      setApplicants(applicants);
      setWishlist(wishlist);
      setShortlisted(shortlisted);
      setSelected(selected);
      setRejected(rejected);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.msg || "Error fetching applications"
      );
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch of applications
  useEffect(() => {
    fetchApplications();
  }, [jobId]);

  // Handle Applicant Status Update
  const handleUpdateStatus = async (employeeId, status) => {
    setIsUpdating(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("No token found. Please log in.");
        setIsUpdating(false);
        return;
      }

      const response = await axios.patch(
        `${SERVER_URL}api/employer/update-applicant-status`,
        { jobId, employeeId, action: status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.msg) {
        alert(response.data.msg); // Show success notification
      }

      // Re-fetch the applications to update the tables after status change
      fetchApplications(); 

    } catch (error) {
      setErrorMessage(
        error.response?.data?.msg || "Error updating applicant status."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const renderTable = (title, data, status) => (
    <div className="table-section">
      <h3>{title}</h3>
      {(!data || data.length === 0) ? (
        <p>No {title.toLowerCase()} yet.</p>
      ) : (
        <table className="applicants-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Resume</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.map((applicant, index) => {
              if (!applicant || !applicant._id) {
                return null; // Skip invalid entries
              }

              return (
                <tr key={applicant._id}>
                  <td>{index + 1}</td>
                  <td>
                    <a href={`/employer/candidate/${applicant._id}`}>
                      {applicant.firstname} {applicant.lastname}
                    </a>
                  </td>
                  <td>{applicant.email}</td>
                  <td>{applicant.phone}</td>
                  <td>
                    <a
                      href={applicant.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {applicant.resume ? "See Resume" : "Not Available"}
                    </a>
                  </td>
                  <td>
                    {/* Render action buttons conditionally based on status */}
                    {status !== "wishlist" && (
                      <button
                        onClick={() => handleUpdateStatus(applicant._id, "wishlist")}
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Processing..." : "Add to Wishlist"}
                      </button>
                    )}
                    {status !== "shortlisted" && (
                      <button
                        onClick={() => handleUpdateStatus(applicant._id, "shortlisted")}
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Processing..." : "Shortlist"}
                      </button>
                    )}
                    {status !== "selected" && (
                      <button
                        onClick={() => handleUpdateStatus(applicant._id, "selected")}
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Processing..." : "Select"}
                      </button>
                    )}
                    {status !== "rejected" && (
                      <button
                        onClick={() => handleUpdateStatus(applicant._id, "rejected")}
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Processing..." : "Reject"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (errorMessage) {
    return <div>{errorMessage}</div>;
  }

  return (
    <div className="ApplicantsByJob">
      <h2>Applicants for Job</h2>
      {renderTable("Applicants", applicants, "applicants")}
      {renderTable("Wishlist", wishlist, "wishlist")}
      {renderTable("Shortlisted", shortlisted, "shortlisted")}
      {renderTable("Selected", selected, "selected")}
      {renderTable("Rejected", rejected, "rejected")}
    </div>
  );
};

export default ApplicantsByJob;
