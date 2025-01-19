import React, { useState, useEffect } from 'react';
import "../../Styles/EditJobDetails.scss";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const jobCategories = [
    "Administrative Assistant", "Office Manager", "Receptionist", "Customer Service Representative",
    "Call Center Agent", "Technical Support Specialist", "Accountant", "Financial Analyst",
    "Bookkeeper", "Marketing Manager", "Sales Representative", "Digital Marketing Specialist",
    "Software Developer", "IT Support Specialist", "Data Analyst", "Registered Nurse",
    "Medical Assistant", "Pharmacist", "Teacher", "Corporate Trainer", "Academic Counselor",
    "Mechanical Engineer", "Civil Engineer", "Electrical Engineer", "Graphic Designer",
    "Content Writer", "UX/UI Designer", "HR Manager", "Recruitment Specialist",
    "Payroll Coordinator", "Machine Operator", "Electrician", "Carpenter", "Truck Driver",
    "Supply Chain Manager", "Warehouse Associate", "Retail Sales Associate", "Chef",
    "Waitstaff", "Research Scientist", "Lab Technician", "Environmental Analyst", "Lawyer",
    "Paralegal", "Compliance Officer", "other"
];

const experienceLevels = [
    "Internship", "Entry level", "Associate", "Mid-Senior level", "Director", "Executive"
];

const jobTypes = [
    "Full-time", "Part-time", "Contract", "Temporary", "Internship"
];

const EditJobDetails = () => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const { id } = useParams();

    const [jobDetails, setJobDetails] = useState({});
    const [cities, setCities] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) throw new Error("No token found");

                const response = await axios.get(`${SERVER_URL}api/employer/fetchsinglejob/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const job = response.data.job;
                console.log(job);
                setJobDetails(job);
                setSelectedCities(job.location.map(city => ({ value: city, label: city })));
            } catch (error) {
                setMessage(`Error: ${error.response?.data?.msg || error.message}`);
            } finally {
                setLoading(false);
            }
        };

        const fetchCities = async () => {
            try {
                const response = await axios.post('https://countriesnow.space/api/v0.1/countries/cities', { country: 'India' });
                const cityOptions = response.data.data.map(city => ({ value: city, label: city }));
                cityOptions.push({ value: 'Remote', label: 'Remote' });
                setCities(cityOptions);
            } catch (error) {
                setMessage(`Error fetching cities: ${error.message}`);
            }
        };

        fetchJobDetails();
        fetchCities();
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setJobDetails(prev => ({ ...prev, [name]: value }));
    };

    const handleCityChange = (selectedOptions) => {
        const citiesArray = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setSelectedCities(selectedOptions);
        setJobDetails(prev => ({ ...prev, location: citiesArray }));
    };

    const handleSave = async () => {
        if (!isEditing) {
            setIsEditing(true);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No token found");

            const response = await axios.put(`${SERVER_URL}api/employer/editjob/${id}`, jobDetails, {
                headers: { Authorization: `Bearer ${token}` },
            });

            toast.success(response.data.msg || "Job updated successfully!");
        } catch (error) {
            toast.error(`Error updating job: ${error.response?.data?.msg || error.message}`);
        } finally {
            setIsEditing(false);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className='EditJobDetails'>
            <div className="jobform">
                <div className="heading">
                    <h2>Edit Job Details ➡️</h2>
                    <button onClick={handleSave}>
                        {isEditing ? "Save Changes" : "Edit Job"}
                    </button>
                </div>

                <div className="jobinputs">

                    <div className="group">
                        <label>Job Title</label>
                        <input
                            type="text"
                            name="jobtitle"
                            value={jobDetails.jobtitle || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="group">
                        <label>Job Type</label>
                        <select
                            name="jobtype"
                            value={jobDetails.jobtype || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        >
                            <option value="">Select job type</option>
                            {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                    </div>

                    <div className="group">
                        <label>Job Category</label>
                        <select
                            name="jobcategory"
                            value={jobDetails.jobcategory || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        >
                            <option value="">Select category</option>
                            {jobCategories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>

                    <div className="group">
                        <label>Salary Range</label>
                        <input
                            type="text"
                            name="salaryrange"
                            value={jobDetails.salaryrange || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="group">
                        <label>Experience Level</label>
                        <select
                            name="experiencelevel"
                            value={jobDetails.experiencelevel || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        >
                            <option value="">Select experience level</option>
                            {experienceLevels.map(level => <option key={level} value={level}>{level}</option>)}
                        </select>
                    </div>

                    <div className="group">
                        <label htmlFor="">Application Deadline</label>
                        <input
                            type="date"
                            name="applicationdeadline"
                            value={jobDetails.applicationdeadline.split("T")[0] || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>

                </div>

                <div className="jobinputs2">
                    <div className="group">
                        <label>Location</label>
                        <Select
                            isMulti
                            options={cities}
                            value={selectedCities}
                            onChange={handleCityChange}
                            isDisabled={!isEditing}
                        />
                    </div>

                    <div className="group">
                        <label>Job Description</label>
                        <textarea
                            rows={3}
                            name="jobdescription"
                            value={jobDetails.jobdescription || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="group">
                        <label htmlFor="">Job Requirements (skills, comma-separated)</label>
                        <input type="text"
                            name="jobrequirements"
                            value={jobDetails.jobrequirements || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>

                    <div className="group">
                        <label htmlFor="">Job Responsibilities</label>
                        <textarea
                            rows={3}
                            name="jobresponsibilities"
                            value={jobDetails.jobresponsibilities ? jobDetails.jobresponsibilities.join('\n') : ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            placeholder={`Example:\n Resolve conflicts within team members.\n Support team building activities.`}
                        />
                    </div>

                    <div className="group">
                        <label htmlFor="">Preferred Qualifications</label>
                        <textarea
                            rows={3}
                            name="preferredqualifications"
                            value={jobDetails.preferredqualifications ? jobDetails.preferredqualifications.join('\n') : ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div >
    );
};

export default EditJobDetails;
