import React, { useEffect, useState } from 'react';
import { getTokenAndRole } from '../../utils/authUtils';
import axios from 'axios';
import notfound from "../../assets/notfound.png";
import location from "../../assets/location.png";
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";
import "../../Styles/SavedJobs.scss";

const SavedJobs = () => {
    const { token, role } = getTokenAndRole();
    const [savedJobs, setSavedJobs] = useState([]);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSavedJobs = async () => {
            if (!token) {
                console.log("No token found");
                return;
            }

            try {
                const response = await axios.get(`${SERVER_URL}api/employee/saved-jobs`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setSavedJobs(response.data.savedJobs);
            } catch (error) {
                console.error("Error fetching saved jobs:", error.message);
            }
        };

        fetchSavedJobs();
    }, [token, SERVER_URL]);

    const handlejobcardclick = (id) => {
        navigate(`/job/${id}`);
    };

    const toggleSaveJob = async (jobId) => {
        if (!token) {
            console.error("No token found");
            return;
        }

        try {
            // Toggle save job on the server
            await axios.post(`${SERVER_URL}api/employee/toggle-save/${jobId}`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Update the local saved jobs state
            setSavedJobs((prevSavedJobs) =>
                prevSavedJobs.some((job) => job._id === jobId)
                    ? prevSavedJobs.filter((job) => job._id !== jobId) 
                    : [...prevSavedJobs, { _id: jobId }] 
            );
        } catch (error) {
            console.error("Error toggling save job:", error.message);
        }
    };

    return (
        <div className="SavedJobs">
            <h1>Saved Jobs</h1>
            <div className="jobs">
                {savedJobs.length > 0 ? (
                    savedJobs.map((job) => (
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
                                        icon={savedJobs.some((savedJob) => savedJob._id === job._id) ? solidBookmark : regularBookmark}
                                        onClick={() => toggleSaveJob(job._id)}
                                    />
                                </div>
                            </div>

                            <div className="jobcardbottom">
                                <h2>{job.jobtitle}</h2>
                                <div className="job-info">
                                    <p>{job.jobtype}</p>

                                    {Array.isArray(job.location)
                                        ? job.location.map((city, index) => (
                                            <p key={index}><img src={location} alt="" />{city}</p>
                                        ))
                                        : (
                                            <p><img src={location} alt="" />{job.location}</p>
                                        )}

                                    <p>{job.experiencelevel}</p>
                                    <p>{job.salaryrange}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No Jobs Saved</p>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;
