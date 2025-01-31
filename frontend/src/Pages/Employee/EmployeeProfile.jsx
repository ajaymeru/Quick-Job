import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../../Styles/EmployeeProfile.scss";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faCircleXmark } from '@fortawesome/free-regular-svg-icons';

const EmployeeProfile = () => {
    const [employee, setEmployee] = useState(null);
    const [cities, setCities] = useState([]);
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const [isEditing, setIsEditing] = useState(false);
    const [experience, setExperience] = useState([]);
    const [education, setEducation] = useState([]);
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        resumeheadline: "",
        location: "",
        yearsOfExperience: "",
        skills: [],
        profileImage: null,
        resume: null,
        socialLinks: {
            linkedIn: "",
            github: "",
            portfolio: "",
            twitter: "",
        },
    });

    useEffect(() => {
        const fetchMyDetails = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    console.log("No token found");
                    return;
                }
                const response = await axios.get(`${SERVER_URL}api/employee/mydetails`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
                });
                setEmployee(response.data.employee);
                setFormData({
                    firstname: response.data.employee.firstname,
                    lastname: response.data.employee.lastname,
                    email: response.data.employee.email,
                    phone: response.data.employee.phone,
                    resumeheadline: response.data.employee.resumeheadline,
                    location: response.data.employee.location,
                    yearsOfExperience: response.data.employee.yearsOfExperience,
                    skills: response.data.employee.skills || [],
                    profileImage: null,
                    resume: null,
                    socialLinks: response.data.employee.socialLinks || {
                        linkedIn: "",
                        github: "",
                        portfolio: "",
                        twitter: "",
                    },
                });
                setExperience(response.data.employee.experience || []);
                setEducation(response.data.employee.education || []);
                setProjects(response.data.employee.projects || []);
            } catch (error) {
                console.error("Error fetching employee details:", error);
            }
        };

        const fetchCities = async () => {
            try {
                const response = await axios.post('https://countriesnow.space/api/v0.1/countries/cities', { country: 'India' });
                if (!response.data.error) {
                    const cityOptions = response.data.data.map(city => ({
                        value: city,
                        label: city,
                    }));
                    setCities(cityOptions);
                } else {
                    console.log(response.data.msg);
                }
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        };

        fetchMyDetails();
        fetchCities();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prev => ({ ...prev, [name]: files[0] }));
    };
    const handleSkillChange = (index, value) => {
        const updatedSkills = [...formData.skills];
        updatedSkills[index] = value;
        setFormData(prev => ({ ...prev, skills: updatedSkills }));
    };
    const handleAddSkill = () => {
        setFormData(prev => ({ ...prev, skills: [...prev.skills, ""] }));
    };
    const handleRemoveSkill = (index) => {
        const updatedSkills = [...formData.skills];
        updatedSkills.splice(index, 1);
        setFormData(prev => ({ ...prev, skills: updatedSkills }));
    };

    const handleExperienceChange = (index, field, value) => {
        const updatedExperience = [...experience];
        updatedExperience[index] = { ...updatedExperience[index], [field]: value };
        setExperience(updatedExperience);
    };

    const handleAddExperience = () => {
        setExperience([...experience, {
            companyName: '',
            position: '',
            startDate: '',
            endDate: '',
            description: '',
            location: '',
        }]);
    };

    const handleRemoveExperience = (index) => {
        const updatedExperience = [...experience];
        updatedExperience.splice(index, 1);
        setExperience(updatedExperience);
    };

    const handleEducationChange = (index, field, value) => {
        const updatedEducation = [...education];
        updatedEducation[index] = { ...updatedEducation[index], [field]: value };
        setEducation(updatedEducation);
    };

    const handleAddEducation = () => {
        setEducation([...education, {
            institution: '',
            degree: '',
            fieldOfStudy: '',
            startDate: '',
            endDate: '',
            location: '',
        }]);
    };

    const handleRemoveEducation = (index) => {
        const updatedEducation = [...education];
        updatedEducation.splice(index, 1);
        setEducation(updatedEducation);
    };

    const handleProjectChange = (index, field, value) => {
        const updatedProjects = [...projects];
        updatedProjects[index] = { ...updatedProjects[index], [field]: value };
        setProjects(updatedProjects);
    };

    const handleTechnologyChange = (projectIndex, techIndex, value) => {
        const updatedProjects = [...projects];
        updatedProjects[projectIndex].technologies[techIndex] = value;
        setProjects(updatedProjects);
    };

    const handleAddTechnology = (projectIndex) => {
        const updatedProjects = [...projects];
        updatedProjects[projectIndex].technologies.push('');
        setProjects(updatedProjects);
    };

    const handleRemoveTechnology = (projectIndex, techIndex) => {
        const updatedProjects = [...projects];
        updatedProjects[projectIndex].technologies.splice(techIndex, 1);
        setProjects(updatedProjects);
    };


    const handleAddProject = () => {
        setProjects([...projects, {
            title: '',
            description: '',
            link: '',
            technologies: ['', ''],
        }]);
    };
    const handleRemoveProject = (index) => {
        const updatedProjects = [...projects];
        updatedProjects.splice(index, 1);
        setProjects(updatedProjects);
    };

    const handleSocialLinkChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [name]: value,
            }
        }));
    };


    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.log("No token found");
                return;
            }
            const data = new FormData();
            data.append('firstname', formData.firstname);
            data.append('lastname', formData.lastname);
            data.append('email', formData.email);
            data.append('phone', formData.phone);
            data.append('resumeheadline', formData.resumeheadline);
            data.append('location', formData.location)
            data.append('yearsOfExperience', formData.yearsOfExperience)
            data.append('skills', JSON.stringify(formData.skills));
            data.append('experience', JSON.stringify(experience));
            data.append('education', JSON.stringify(education));
            data.append('projects', JSON.stringify(projects));
            data.append('socialLinks', JSON.stringify(formData.socialLinks));
            if (formData.profileImage) data.append('profileImage', formData.profileImage);
            if (formData.resume) data.append('resume', formData.resume);

            const response = await axios.put(`${SERVER_URL}api/employee/editemployeedetails`, data, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                }
            });
            setEmployee(response.data.employee);
            alert("Details updated successfully");
            setIsEditing(false);
        } catch (error) {
            console.error("Error updating employee details:", error);
        }
    };

    if (!employee) {
        return <div>Loading...</div>;
    }

    return (
        <div className='EmployeeProfile'>
            <div className="profile">
                <div className="user-profile">
                    <img
                        src={employee.profileImage}
                        alt="user-profile"
                        className="profile-image"
                    />
                    {isEditing && (
                        <input
                            type="file"
                            name="profileImage"
                            accept="image/*"
                            onChange={handleFileChange}
                        />
                    )}
                </div>
                <div className="user-info">
                    <div className="group-row">
                        <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            placeholder="First Name"
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                        <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            placeholder="Last Name"
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <p>Last updated on {new Date(employee.updatedAt).toDateString()}</p>
                    <div className="groups">
                        <div className="group">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="group">
                            <label>Phone:</label>
                            <input
                                type="number"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="group">
                            <label>Location:</label>
                            {isEditing ? (
                                <select
                                    name="location"
                                    value={formData.location || ""}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select a location</option>
                                    {cities.map((city, index) => (
                                        <option key={index} value={city.value}>
                                            {city.label}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location || "Not Set"}
                                    disabled
                                />
                            )}
                        </div>
                        {/* add drop down to select yeasrs of experiece show 0-50 */}
                        <div className="group">
                            <label>Years of Experience:</label>
                            {isEditing ? (
                                <select
                                    name="yearsOfExperience"
                                    value={formData.yearsOfExperience || 0}
                                    onChange={handleInputChange}
                                >
                                    {Array.from({ length: 51 }, (_, i) => (
                                        <option key={i} value={i}>
                                            {i}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type="text"
                                    name="yearsOfExperience"
                                    value={formData.yearsOfExperience || "Not Set"}
                                    disabled
                                />
                            )}
                        </div>

                    </div>
                </div>
                <button onClick={() => setIsEditing(!isEditing)}>
                    {isEditing ? (
                        <>
                            <FontAwesomeIcon icon={faPenToSquare} /> Cancel
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faPenToSquare} /> Edit
                        </>
                    )}
                </button>

                {isEditing && <button onClick={handleSave}>Save</button>}
            </div>
            <div className="resume-headline">
                <h3>Resume Headline</h3>
                <input
                    type="text"
                    name="resumeheadline"
                    value={formData.resumeheadline}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                />
            </div>
            <div className="resume">
                <a href={employee.resume} target="_blank" rel="noreferrer">View Resume</a>
                {isEditing && (
                    <input
                        type="file"
                        name="resume"
                        accept=".pdf"
                        onChange={handleFileChange}
                    />
                )}
            </div>
            <div className="skills">
                <h3>Skills</h3>
                <div className="skill-list">
                    {formData.skills.map((skill, index) => (
                        <div key={index} className="skill-item">
                            <input
                                type="text"
                                value={skill}
                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                disabled={!isEditing}
                                placeholder="Enter skill"
                            />
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveSkill(index)}
                                    className="remove-skill-btn"
                                >
                                    < FontAwesomeIcon icon={faCircleXmark} />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {isEditing && (
                    <button type="button" onClick={handleAddSkill} className="add-skill-btn">
                        Add Skill
                    </button>
                )}
            </div>
            <div className="experience">
                <h3>Experience</h3>
                {experience.map((exp, index) => (
                    <div key={index} className="experience-item">
                        <input
                            type="text"
                            placeholder="Company Name"
                            value={exp.companyName}
                            onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
                            disabled={!isEditing}
                        />
                        <input
                            type="text"
                            placeholder="Position"
                            value={exp.position}
                            onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                            disabled={!isEditing}
                        />
                        <input
                            type="date"
                            placeholder="Start Date"
                            value={new Date(exp.startDate).toISOString().split('T')[0]}
                            // value={exp.startDate.split('T')[0]}
                            onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                            disabled={!isEditing}
                        />
                        <input
                            type="date"
                            placeholder="End Date"
                            value={new Date(exp.endDate).toISOString().split('T')[0]}
                            // value={exp.endDate.split('T')[0]}
                            onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                            disabled={!isEditing}
                        />
                        <textarea
                            placeholder="Description"
                            value={exp.description}
                            onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                            disabled={!isEditing}
                        />
                        <input
                            type="text"
                            placeholder="Location"
                            value={exp.location}
                            onChange={(e) => handleExperienceChange(index, 'location', e.target.value)}
                            disabled={!isEditing}
                        />
                        {isEditing && (
                            <button onClick={() => handleRemoveExperience(index)} className="remove-experience-btn">
                                <FontAwesomeIcon icon={faCircleXmark} /> Remove
                            </button>
                        )}
                    </div>
                ))}
                {isEditing && (
                    <button onClick={handleAddExperience} className="add-experience-btn">
                        Add Experience
                    </button>
                )}
            </div>
            <div className="education">
                <h3>Education</h3>
                {education.map((edu, index) => (
                    <div key={index} className="education-item">
                        <input
                            type="text"
                            placeholder="Institution"
                            value={edu.institution}
                            onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                            disabled={!isEditing}
                        />
                        <input
                            type="text"
                            placeholder="Degree"
                            value={edu.degree}
                            onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                            disabled={!isEditing}
                        />
                        <input
                            type="text"
                            placeholder="Field of Study"
                            value={edu.fieldOfStudy}
                            onChange={(e) => handleEducationChange(index, 'fieldOfStudy', e.target.value)}
                            disabled={!isEditing}
                        />
                        <input
                            type="date"
                            placeholder="Start Date"
                            // value={new Date(edu.startDate).toISOString().split('T')[0]}
                            value={edu.startDate.split('T')[0]}
                            onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                            disabled={!isEditing}
                        />
                        <input
                            type="date"
                            placeholder="End Date"
                            // value={new Date(edu.endDate).toISOString().split('T')[0]}
                            value={edu.endDate.split('T')[0]}
                            onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                            disabled={!isEditing}
                        />
                        <input
                            type="text"
                            placeholder="Location"
                            value={edu.location}
                            onChange={(e) => handleEducationChange(index, 'location', e.target.value)}
                            disabled={!isEditing}
                        />
                        {isEditing && (
                            <button onClick={() => handleRemoveEducation(index)} className="remove-education-btn">
                                <FontAwesomeIcon icon={faCircleXmark} /> Remove
                            </button>
                        )}
                    </div>
                ))}
                {isEditing && (
                    <button onClick={handleAddEducation} className="add-education-btn">
                        Add Education
                    </button>
                )}
            </div>
            <div className="projects">
                <h3>Projects</h3>
                {projects.map((proj, projectIndex) => (
                    <div key={projectIndex} className="project-item">
                        <input
                            type="text"
                            placeholder="Project Title"
                            value={proj.title}
                            onChange={(e) => handleProjectChange(projectIndex, 'title', e.target.value)}
                            disabled={!isEditing}
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={proj.description}
                            onChange={(e) => handleProjectChange(projectIndex, 'description', e.target.value)}
                            disabled={!isEditing}
                        />
                        <input
                            type="text"
                            placeholder="Link"
                            value={proj.link}
                            onChange={(e) => handleProjectChange(projectIndex, 'link', e.target.value)}
                            disabled={!isEditing}
                        />

                        {proj.technologies.map((tech, techIndex) => (
                            <div key={techIndex} className="technology-input">
                                <input
                                    type="text"
                                    placeholder="Technology"
                                    value={tech}
                                    onChange={(e) => handleTechnologyChange(projectIndex, techIndex, e.target.value)}
                                    disabled={!isEditing}
                                />
                                {isEditing && (
                                    <button
                                        onClick={() => handleRemoveTechnology(projectIndex, techIndex)}
                                        className="remove-technology-btn"
                                    >
                                        <FontAwesomeIcon icon={faCircleXmark} /> Remove
                                    </button>
                                )}
                            </div>
                        ))}

                        {isEditing && (
                            <button
                                onClick={() => handleAddTechnology(projectIndex)}
                                className="add-technology-btn"
                            >
                                Add Technology
                            </button>
                        )}

                        {isEditing && (
                            <button
                                onClick={() => handleRemoveProject(projectIndex)}
                                className="remove-project-btn"
                            >
                                <FontAwesomeIcon icon={faCircleXmark} /> Remove Project
                            </button>
                        )}
                    </div>
                ))}
                {isEditing && (
                    <button onClick={handleAddProject} className="add-project-btn">
                        Add Project
                    </button>
                )}
            </div>
            <div className="social-links">
                <div className="group">
                    <label>LinkedIn:</label>
                    <input
                        type="text"
                        name="linkedIn"
                        value={formData.socialLinks.linkedIn}
                        onChange={(e) => handleSocialLinkChange(e)}
                        disabled={!isEditing}
                    />
                </div>
                <div className="group">
                    <label>GitHub:</label>
                    <input
                        type="text"
                        name="github"
                        value={formData.socialLinks.github}
                        onChange={(e) => handleSocialLinkChange(e)}
                        disabled={!isEditing}
                    />
                </div>
                <div className="group">
                    <label>Portfolio:</label>
                    <input
                        type="text"
                        name="portfolio"
                        value={formData.socialLinks.portfolio}
                        onChange={(e) => handleSocialLinkChange(e)}
                        disabled={!isEditing}
                    />
                </div>
                <div className="group">
                    <label>Twitter:</label>
                    <input
                        type="text"
                        name="twitter"
                        value={formData.socialLinks.twitter}
                        onChange={(e) => handleSocialLinkChange(e)}
                        disabled={!isEditing}
                    />
                </div>
            </div>
        </div>
    );
};

export default EmployeeProfile;
