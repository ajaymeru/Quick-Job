import React, { useEffect, useState } from 'react'
import "../../Styles/CvBuilder.scss"
import axios from 'axios'

const CvBuilder = () => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL
    const [userdata, setuserdata] = useState(null)
    const [buildResume, setBuildResume] = useState(false)

    useEffect(() => {
        const fetchmydetails = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    console.log('Token not found');
                    return;
                }
                const response = await axios.get(`${SERVER_URL}api/employee/mydetails`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                setuserdata(response.data.employee)
            } catch (error) {
                console.log(error)
            }
        }
        fetchmydetails()
    }, [])

    const handleBuildResume = () => {
        setBuildResume(true)
    }

    const formatDate = (date) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(date).toLocaleDateString(undefined, options);
    }

    const generateResume = () => {
        if (!userdata) return null;

        return (
            <div className="resume-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <div className="header" style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <h2 style={{ margin: '0', fontSize: '28px' }}>{userdata.firstname} {userdata.lastname}</h2>
                    <p style={{ margin: '5px 0' }}>Email: {userdata.email} | Phone: {userdata.phone}</p>
                    <p style={{ margin: '5px 0' }}>
                        LinkedIn: <a href={`https://www.linkedin.com/in/${userdata.socialLinks.linkedIn}`} target="_blank" rel="noopener noreferrer">{userdata.socialLinks.linkedIn}</a>
                    </p>
                    <p style={{ margin: '5px 0' }}>
                        GitHub: <a href={userdata.socialLinks.github} target="_blank" rel="noopener noreferrer">{userdata.socialLinks.github}</a>
                    </p>
                </div>

                <div className="summary" style={{ marginBottom: '30px' }}>
                    <h4 style={{ fontSize: '20px', marginBottom: '10px' }}>Resume Headline</h4>
                    <p>{userdata.resumeheadline}</p>
                </div>

                <div className="education" style={{ marginBottom: '30px' }}>
                    <h4 style={{ fontSize: '20px', marginBottom: '10px' }}>Education</h4>
                    {userdata.education.map((edu, index) => (
                        <div key={index} style={{ marginBottom: '15px' }}>
                            <h5 style={{ margin: '0', fontSize: '18px' }}>{edu.degree} - {edu.fieldOfStudy}</h5>
                            <p style={{ margin: '5px 0' }}>{edu.institution}, {edu.location}</p>
                            <p style={{ margin: '5px 0' }}>{formatDate(edu.startDate)} - {formatDate(edu.endDate)}</p>
                        </div>
                    ))}
                </div>

                <div className="experience" style={{ marginBottom: '30px' }}>
                    <h4 style={{ fontSize: '20px', marginBottom: '10px' }}>Experience</h4>
                    {userdata.experience.map((exp, index) => (
                        <div key={index} style={{ marginBottom: '15px' }}>
                            <h5 style={{ margin: '0', fontSize: '18px' }}>{exp.position} at {exp.companyName}</h5>
                            <p style={{ margin: '5px 0' }}>{exp.location}</p>
                            <p style={{ margin: '5px 0' }}>{formatDate(exp.startDate)} - {formatDate(exp.endDate)}</p>
                            <p>{exp.description}</p>
                        </div>
                    ))}
                </div>

                <div className="projects" style={{ marginBottom: '30px' }}>
                    <h4 style={{ fontSize: '20px', marginBottom: '10px' }}>Projects</h4>
                    {userdata.projects.map((project, index) => (
                        <div key={index} style={{ marginBottom: '15px' }}>
                            <h5 style={{ margin: '0', fontSize: '18px' }}>{project.title}</h5>
                            <p>{project.description}</p>
                            <p>
                                <a href={project.link} target="_blank" rel="noopener noreferrer">View Project</a>
                            </p>
                            <p style={{ margin: '5px 0' }}>Technologies Used: {project.technologies.join(', ')}</p>
                        </div>
                    ))}
                </div>

                <div className="skills" style={{ marginBottom: '30px' }}>
                    <h4 style={{ fontSize: '20px', marginBottom: '10px' }}>Skills</h4>
                    <ul style={{ listStyleType: 'none', paddingLeft: '0' }}>
                        {userdata.skills.map((skill, index) => (
                            <li key={index} style={{ marginBottom: '5px' }}>{skill}</li>
                        ))}
                    </ul>
                </div>

                <div className="footer" style={{ textAlign: 'center', marginTop: '30px' }}>
                    <p style={{ margin: '0' }}>Resume generated on {new Date().toLocaleDateString()}</p>
                </div>
            </div>
        );
    };

    return (
        <div className='CvBuilder'>
            <button className="btn btn-primary" style={{ margin: '20px', fontSize: '18px' }} onClick={handleBuildResume}>
                Build Resume
            </button>
            {buildResume && generateResume()}
        </div>
    )
}

export default CvBuilder
