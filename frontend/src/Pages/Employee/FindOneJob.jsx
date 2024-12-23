import React, { useEffect, useState } from 'react'
import "../../Styles/FindOneJob.scss"
import { useParams } from 'react-router-dom';
import axios from 'axios';

const FindOneJob = () => {
    const { id } = useParams()
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const [job, setJob] = useState(null)

    useEffect(() => {
        const fetchjob = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found");
                    return;
                }
                const url = `${SERVER_URL}api/employee/job/${id}`;
                console.log("Fetching job details from:", url);
                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.data && response.data.job) {
                    console.log("Fetched Job:", response.data.job);
                    setJob(response.data.job);
                } else {
                    console.error("No job data found in response.");
                }
            } catch (error) {
                console.error("Error fetching job:",  error.message);
            }
        };
        fetchjob();
    }, [id, SERVER_URL]);
    
    

    return (
        <div className='FindOneJob'>
            {job ? (
                <div className="job-details">
                    <h1>{job.jobtitle}</h1>
                    <p><strong>Category:</strong> {job.jobcategory}</p>
                    <p><strong>Description:</strong> {job.jobdescription}</p>
                    <p><strong>Requirements:</strong> {job.jobrequirements}</p>
                    <p><strong>Responsibilities:</strong> {job.jobresponsibilities}</p>
                    <p><strong>Salary:</strong> {job.salaryrange}</p>
                    <p><strong>Experience Level:</strong> {job.experiencelevel}</p>
                    <p><strong>Location:</strong> {job.location}</p>
                    <p><strong>Application Deadline:</strong> {new Date(job.applicationdeadline).toDateString()}</p>
                </div>
            ) : (
                <p>Loading job details...</p>
            )}
        </div>
    )
}

export default FindOneJob