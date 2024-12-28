import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import "../../Styles/Postjob.scss";

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

const jobtype = [
  "Full-time", "Part-time", "Contract", "Temporary", "Internship"
]

const Postjob = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;

  const [formData, setFormData] = useState({
    jobtitle: '',
    jobtype: '',
    jobcategory: '',
    jobdescription: '',
    jobrequirements: '',
    jobresponsibilities: '',
    salaryrange: '',
    experiencelevel: '',
    preferredqualifications: '',
    location: [],
    applicationdeadline: ''
  });

  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const [cities, setCities] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);

  useEffect(() => {
    axios.post('https://countriesnow.space/api/v0.1/countries/cities', { country: 'India' })
      .then(response => {
        if (!response.data.error) {
          const cityOptions = response.data.data.map(city => ({
            value: city,
            label: city
          }));
          cityOptions.push({ value: 'Remote', label: 'Remote' });
          setCities(cityOptions);
        } else {
          setMessage('Error fetching cities.');
        }
      })
      .catch(error => {
        setMessage(`Error: ${error.message}`);
      });
  }, []);

  const handleCityChange = (selectedOptions) => {
    const citiesArray = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setSelectedCities(citiesArray);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("No token found. Please log in.");
        setLoading(false);
        return;
      }

      const response = await axios.post(`${SERVER_URL}api/employer/post`, {
        ...formData,
        location: selectedCities,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage(response.data.msg);
      setFormData({
        jobtitle: '',
        jobtype: '',
        jobcategory: '',
        jobdescription: '',
        jobrequirements: '',
        jobresponsibilities: '',
        salaryrange: '',
        experiencelevel: '',
        preferredqualifications: '',
        location: [],
        applicationdeadline: ''
      });
      setSelectedCities([]);
    } catch (error) {
      setMessage(`Error posting job: ${error.response?.data?.msg || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Postjob">
      <div className="jobform">
        <div className="heading">
          <h2>Post a New Job</h2>
        </div>

        {message && <p className="message">{message}</p>}
        <p className="note">Fields marked with * are required.</p>

        <form onSubmit={handleSubmit}>
          <div className="jobinputs">
            <div className="group">
              <label>Job Title *</label>
              <input
                type="text"
                name="jobtitle"
                value={formData.jobtitle}
                onChange={handleChange}
                required
                placeholder='e.g., Software Developer'
              />
            </div>

            <div className="group">
              <label>Job Type *</label>
              <select
                name="jobtype"
                value={formData.jobtype}
                onChange={handleChange}
                required>
                <option value="">Select job type</option>
                {jobtype.map((type, index) => (
                  <option key={index} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="group">
              <label>Job Category </label>
              <select
                name="jobcategory"
                value={formData.jobcategory}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                {jobCategories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="group">
              <label>Salary Range</label>
              <input
                type="text"
                name="salaryrange"
                value={formData.salaryrange}
                onChange={handleChange}
                required
                placeholder='e.g., 3LPA - 4LPA'
              />
            </div>

            <div className="group">
              <label>Experience Level</label>
              <select
                name="experiencelevel"
                value={formData.experiencelevel}
                onChange={handleChange}
                required
              >
                <option value="">Select experience level</option>
                {experienceLevels.map((level, index) => (
                  <option key={index} value={level}>{level}</option>
                ))}
              </select>
            </div>


            <div className="group">
              <label>Application Deadline</label>
              <input
                type="date"
                name="applicationdeadline"
                value={formData.applicationdeadline}
                onChange={handleChange}
                required
              />
            </div>

          </div>

          <div className="jobinputs2">

            <div className="group">
              <label>Location</label>
              <Select
                className='select'
                isMulti
                name="cities"
                options={cities}
                value={selectedCities.map(city => ({ value: city, label: city }))}
                onChange={handleCityChange}
                placeholder="Search for cities or select Remote"
                closeMenuOnSelect={false}
                required
              />
            </div>

            <div className="group">
              <label>Job Description *</label>
              <textarea
                rows={2}
                name="jobdescription"
                value={formData.jobdescription}
                onChange={handleChange}
                required
                placeholder='We are seeking a Front-End Developer to join our dynamic and innovative team. The ideal candidate will have a passion for creating engaging user experiences and possess strong problem-solving skills. This role involves working collaboratively with cross-functional teams to design, develop, and maintain web applications that meet client and user needs.'
              />
            </div>

            <div className="group">
              <label>Job Requirements (skills, comma-separated) *</label>
              <input
                type="text"
                name="jobrequirements"
                value={formData.jobrequirements}
                onChange={handleChange}
                placeholder="e.g., HTML, CSS, JavaScript"
                required
              />
            </div>

            <div className="group">
              <label htmlFor="">Job Responsibilities</label>
              <textarea
                rows={3}
                name="jobresponsibilities"
                value={formData.jobresponsibilities}
                onChange={handleChange}
                required
                placeholder={`Example:\n Resolve conflicts within team members.\n Support team building activities.`}
              />
            </div>

            <div className="group">
              <label>Preferred Qualifications</label>
              <textarea
                rows={3}
                name="preferredqualifications"
                value={formData.preferredqualifications}
                onChange={handleChange}
                placeholder={`Example:\n Bachelor's degree in Computer Science.\n 3+ years of experience in software development.`}
              />
            </div>

          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Posting Job..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Postjob;
