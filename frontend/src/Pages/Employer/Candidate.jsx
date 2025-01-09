import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "../../Styles/Candidate.scss";

const Candidate = () => {
    const { id } = useParams();
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const [employee, setEmployee] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No token found. Please log in.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${SERVER_URL}api/employer/fetchApplicantById/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setEmployee(response.data.applicant);
            } catch (err) {
                setError(err.response?.data?.msg || "Error fetching applicant data.");
            } finally {
                setLoading(false);
            }
        };

        fetchEmployee();
    }, [id]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="Candidate">
            <div className="profile-details">
                <img
                    src={employee.profileImage || "default-image-url"}
                    alt={`${employee.firstname || "User"} ${employee.lastname || ""}`}
                />

                <div className="profile-info">
                    <h2>{employee.firstname || "Unknown"} {employee.lastname || ""}</h2>
                    <p>Email: {employee.email || "Not provided"}</p>
                    <p>Phone: {employee.phone || "Not provided"}</p>
                </div>

                <div className="social-info">
                    {employee.socialLinks?.linkedIn && <a href={employee.socialLinks.linkedIn}>LinkedIn</a>}
                    {employee.socialLinks?.github && <a href={employee.socialLinks.github}>GitHub</a>}
                    {employee.socialLinks?.portfolio && <a href={employee.socialLinks.portfolio}>Portfolio</a>}
                    {employee.socialLinks?.twitter && <a href={employee.socialLinks.twitter}>Twitter</a>}
                </div>
            </div>

            {employee.resumeheadline && (
                <div className="resume-headline">
                    <h5>Resume Headline:</h5>
                    <textarea readOnly
                        ref={(textarea) => {
                            if (textarea) {
                                textarea.style.height = "auto";
                                textarea.style.height = textarea.scrollHeight + "px";
                            }
                        }}>{employee.resumeheadline}</textarea>
                </div>
            )}

            {employee.skills?.length > 0 && (
                <div className="skills">
                    <h5>Skills:</h5>
                    <ul>
                        {employee.skills.map((skill, index) => (
                            <li key={index}>{skill}</li>
                        ))}
                    </ul>
                </div>
            )}

            {employee.experience?.length > 0 && (
                <div className="experience">
                    <h5>Experience:</h5>
                    {employee.experience.map((experience, index) => (
                        <div className="experience-item" key={index}>
                            <h4>{experience.position} at {experience.companyName}</h4>
                            <p>
                                {new Date(experience.startDate).toLocaleDateString()} -
                                {new Date(experience.endDate).toLocaleDateString()}
                            </p>
                            <h5>Description:</h5>
                            <textarea value={experience.description} readOnly
                                ref={(textarea) => {
                                    if (textarea) {
                                        textarea.style.height = "auto";
                                        textarea.style.height = textarea.scrollHeight + "px";
                                    }
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {employee.education?.length > 0 && (
                <div className="education">
                    <h5>Education:</h5>
                    {employee.education.map((edu, index) => (
                        <div className="education-item" key={index}>
                            <textarea
                                name="educationDetails"
                                id="educationDetails"
                                readOnly
                                value={`${edu.degree} at ${edu.institution} (${edu.location})`}>
                            </textarea>
                            <p>{edu.fieldOfStudy} {new Date(edu.startDate).toLocaleDateString()} - {new Date(edu.endDate).toLocaleDateString()}</p>
                        </div>
                    ))}
                </div>
            )}

            {employee.projects?.length > 0 && (
                <div className="projects">
                    <h5>Projects:</h5>
                    {employee.projects.map((project, index) => (
                        <div className="project-item" key={index}>
                            <h5>{project.title} <a href={project.link}>Link</a></h5>
                            <textarea
                                value={project.description}
                                readOnly
                            ></textarea>
                            <div className="tech">
                                <h5>Technologies:</h5>
                                <ul>
                                    {project.technologies.map((tech, index) => (
                                        <li key={index}>{tech}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Candidate;
