import React, { useEffect, useState } from 'react'
import "../../Styles/FindOneComapny.scss"
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import notfound from "../../assets/notfound.png";
import location from "../../assets/location.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope, faMapMarkerAlt, faGlobe, faBuilding, faPlus } from '@fortawesome/free-solid-svg-icons';
import { faFacebook, faInstagram, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as regularBookmark } from "@fortawesome/free-regular-svg-icons";

const FindOneComapny = () => {
    const { id } = useParams()
    const SERVER_URL = import.meta.env.VITE_SERVER_URL
    const [company, setCompany] = useState(null)
    const [jobs, setJobs] = useState([])
    const [Followers, setFollowers] = useState();
    const navigate = useNavigate();
    const [savedJobs, setSavedJobs] = useState([]);
    const [followCompanies, setFollowCompanies] = useState([]);


    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    console.log("No token Found");
                    return;
                }
                const url = `${SERVER_URL}api/employee/company/${id}`
                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const data = response.data.company
                setCompany(data)
                setJobs(response.data.jobs)
                setFollowers(response.data.followersCount)
                const savedJobsResponse = await axios.get(`${SERVER_URL}api/employee/mydetails`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setSavedJobs(savedJobsResponse.data.employee.savejobs);
                setFollowCompanies(savedJobsResponse.data.employee.followingEmployer || [])
            } catch (error) {
                console.log("Error in fetching company", error.msg)
            }
        }
        fetchCompany()
    }, [id, followCompanies])

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

    const toggleFollowCompany = async (id) => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error("No token found");
                return;
            }

            const response = await axios.post(
                `${SERVER_URL}api/employee/toggle-follow/${id}`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            const updatedFollowingCompanies = response.data.followingCompanies;
            const isFollowing = updatedFollowingCompanies.includes(id);
            setFollowers((prevCount) => (isFollowing ? prevCount + 1 : prevCount - 1));
            setFollowCompanies(updatedFollowingCompanies);
        } catch (error) {
            console.error("Error toggling follow for company:", error);
        }
    };


    return (
        <div className='FindOneComapny'>
            <h1>Company Details</h1>

            {company ? (
                <div className="company-jobs">
                    <div className="company-info">
                        <div className="company-main-info">
                            <div className="logo-types">
                                {company && company.profileImage ? (
                                    <img src={company.profileImage} alt="" />
                                ) : (
                                    <img src={notfound} alt="" />
                                )}
                                <div className="company-name">
                                    <h3>{company.companyname}</h3>
                                    <p>{company.industry}</p>
                                </div>
                            </div>
                            <div className="follow-count">
                                <button onClick={() => toggleFollowCompany(company._id)}>
                                    <FontAwesomeIcon icon={followCompanies.includes(company._id) ? "" : faPlus} />{" "}
                                    {followCompanies.includes(company._id) ? "Unfollow" : "Follow"}
                                </button>
                                <p>{Followers}Followers</p>
                            </div>
                        </div>
                        <div className="company-description">
                            <p>{company.description} </p>
                        </div>
                        <div className="about-company">
                            <h3>About Company</h3>
                            <div className="info">
                                <p>
                                    <FontAwesomeIcon icon={faGlobe} /> <strong>Website:</strong>{" "}
                                    <a href={company.website} target="_blank" rel="noopener noreferrer">
                                        {company.website || "Not Available"}
                                    </a>
                                </p>
                                <p>
                                    <FontAwesomeIcon icon={faBuilding} /> <strong>Company Size:</strong> {company.companySize || "N/A"}
                                </p>
                                <p>
                                    <FontAwesomeIcon icon={faBuilding} /> <strong>Founded:</strong>{" "}
                                    {company.establishedDate ? new Date(company.establishedDate).toDateString() : "N/A"}
                                </p>
                            </div>
                        </div>
                        <div className="contact-company">
                            <div className="location-info">
                                <h3>Contact us on:</h3>
                                <div className="info">
                                    <p>
                                        <FontAwesomeIcon icon={faPhone} /> <strong>Phone:</strong> {company.phone || "N/A"}
                                    </p>
                                    <p>
                                        <FontAwesomeIcon icon={faMapMarkerAlt} /> <strong>Address:</strong> {company.address || "N/A"}
                                    </p>
                                    <p>
                                        <FontAwesomeIcon icon={faEnvelope} /> <strong>Email:</strong> {company.email || "N/A"}
                                    </p>
                                    <p>
                                        <FontAwesomeIcon icon={faMapMarkerAlt} /> <strong>City:</strong> {company.city || "N/A"}
                                    </p>
                                </div>
                            </div>
                            <div className="social-media">
                                <h3>Follow us on:</h3>
                                <div className="info">
                                    <a href={company.facebook || "#"} target="_blank" rel="noopener noreferrer">
                                        <FontAwesomeIcon icon={faFacebook} />
                                    </a>
                                    <a href={company.instagram || "#"} target="_blank" rel="noopener noreferrer">
                                        <FontAwesomeIcon icon={faInstagram} />
                                    </a>
                                    <a href={company.linkedin || "#"} target="_blank" rel="noopener noreferrer">
                                        <FontAwesomeIcon icon={faLinkedin} />
                                    </a>
                                    <a href={company.twitter || "#"} target="_blank" rel="noopener noreferrer">
                                        <FontAwesomeIcon icon={faTwitter} />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="jobs-info">
                        <div className="heading">
                            <h5>Jobs Posted By Company</h5>
                        </div>
                        <div className="jobs">
                            {jobs.length > 0 ? (
                                jobs.map((job) => (
                                    <div className="jobcard" key={job._id} >
                                        <div className="jobcardtop">
                                            <div className="company-info">
                                                {company && company.profileImage ? (
                                                    <img src={company.profileImage} alt="" />
                                                ) : (
                                                    <img src={notfound} alt="" />
                                                )}
                                                <h2>{company.companyname}</h2>
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
                                <p>No jobs available</p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <p>Loading company details...</p>
            )}
        </div>
    )
}

export default FindOneComapny