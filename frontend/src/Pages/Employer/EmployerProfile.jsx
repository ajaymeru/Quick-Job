import React, { useState, useEffect } from 'react';
import "../../Styles/EmployerProfile.scss";
import axios from 'axios';

const industry = [
    "IT Services & Consulting",
    "Software Product",
    "Internet",
    "Electronics Manufacturing",
    "Electronic Components / Semiconductors",
    "Hardware & Networking",
    "Emerging Technologies",
    "Medical Services / Hospital",
    "Pharmaceutical & Life Sciences",
    "Medical Devices & Equipment",
    "Biotechnology",
    "Clinical Research / Contract Research",
    "Industrial Equipment / Machinery",
    "Auto Components",
    "Chemicals",
    "Automobile",
    "Electrical Equipment",
    "Building Material",
    "Industrial Automation",
    "Iron & Steel",
    "Metals & Mining",
    "Packaging & Containers",
    "Petrochemical / Plastics / Rubber",
    "Defence & Aerospace",
    "Fertilizers / Pesticides / Agro chemicals",
    "Pulp & Paper",
    "Education / Training",
    "E-Learning / EdTech",
    "Engineering & Construction",
    "Real Estate",
    "Courier / Logistics",
    "Power",
    "Oil & Gas",
    "Water Treatment / Waste Management",
    "Aviation",
    "Ports & Shipping",
    "Urban Transport",
    "Railways",
    "Financial Services",
    "FinTech / Payments",
    "Insurance",
    "NBFC",
    "Banking",
    "Investment Banking / Venture Capital / Private Equity",
    "Recruitment / Staffing",
    "Management Consulting",
    "Accounting / Auditing",
    "Facility Management Services",
    "Architecture / Interior Design",
    "Legal",
    "Design",
    "Law Enforcement / Security Services",
    "Content Development / Language",
    "Advertising & Marketing",
    "Telecom / ISP",
    "Printing & Publishing",
    "Film / Music / Entertainment",
    "Gaming",
    "TV / Radio",
    "Animation & VFX",
    "Events / Live Entertainment",
    "Sports / Leisure & Recreation",
    "BPO / Call Centre",
    "Analytics / KPO / Research",
    "Textile & Apparel",
    "Retail",
    "Consumer Electronics & Appliances",
    "Food Processing",
    "FMCG",
    "Hotels & Restaurants",
    "Travel & Tourism",
    "Furniture & Furnishing",
    "Beauty & Personal Care",
    "Fitness & Wellness",
    "Gems & Jewellery",
    "Beverage",
    "Leather",
    "NGO / Social Services / Industry Associations",
    "Agriculture / Forestry / Fishing",
    "Import & Export",
    "Miscellaneous",
    "Government / Public Administration"
];


const EmployerProfile = () => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [cities, setCities] = useState([]);
    const [message, setMessage] = useState('');
    const [profileImage, setProfileImage] = useState(null);

    useEffect(() => {
        const fetchMyDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(`${SERVER_URL}api/employer/fetchmydetails`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const employer = response.data.employer;
                setUser(employer);
                console.log(employer);
            } catch (error) {
                console.error("Error fetching employer details:", error.response?.data || error.message);
            } finally {
                setLoading(false);
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
                    cityOptions.push({ value: 'Remote', label: 'Remote' });
                    setCities(cityOptions);
                } else {
                    setMessage('Error fetching cities.');
                }
            } catch (error) {
                setMessage(`Error: ${error.message}`);
            }
        };

        fetchMyDetails();
        fetchCities();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
        }
    };

    const handleEditSave = async () => {
        if (isEditing) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found");
                    return;
                }

                // Create a new FormData object to handle form data including the image
                const formData = new FormData();
                // Append other form data
                formData.append("companyname", user.companyname);
                formData.append("email", user.email);
                formData.append("website", user.website);
                formData.append("establishedDate", user.establishedDate);
                formData.append("industry", user.industry);
                formData.append("companySize", user.companySize);
                formData.append("description", user.description);
                formData.append("phone", user.phone);
                formData.append("address", user.address);
                formData.append("city", user.city);
                formData.append("facebook", user.facebook);
                formData.append("twitter", user.twitter);
                formData.append("linkedin", user.linkedin);
                formData.append("instagram", user.instagram);

                // Append the image file if it exists
                if (profileImage) {
                    formData.append("profileImage", profileImage);
                }

                const response = await axios.put(`${SERVER_URL}api/employer/editmydetails`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data", // Important for file uploads
                    },
                });
                alert("Profile updated successfully!");
            } catch (error) {
                console.error("Error updating profile:", error.response?.data || error.message);
            }
        }
        setIsEditing(!isEditing);
    };


    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="EmployerProfile">
            <div className="Company-Profile">
                <div className="heading">
                    <h2>Company Profile</h2>
                    <button className='editbutton' onClick={handleEditSave}>
                        {isEditing ? "Save" : "Edit"}
                    </button>
                </div>
                <div className="company-info">
                    <div className="group">
                        <label>Company Name</label>
                        <input
                            type="text"
                            name="companyname"
                            value={user.companyname || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="group">
                        <label htmlFor="profileImage">profileImage</label>
                        <input
                            type="file"
                            name="profileImage" id=""
                            accept="image/*"
                            onChange={(e) => handleImageChange(e)}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="group">
                        <label htmlFor="">Website</label>
                        <input
                            type="url"
                            name="website"
                            value={user.website || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="group">
                        <label htmlFor="">Established Date</label>
                        <input
                            type="date"
                            name="establishedDate"
                            value={user.establishedDate ? user.establishedDate.split("T")[0] : ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="group">
                        <label htmlFor="">Industry</label>
                        <select
                            name="industry"
                            value={user.industry || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        >
                            <option value="">Select Industry</option>
                            {industry.map((industry, index) => (
                                <option key={index} value={industry}>{industry}</option>
                            ))}
                        </select>
                    </div>
                    <div className="group">
                        <label htmlFor="">Company Size</label>
                        <input
                            type="text"
                            name="companySize"
                            value={user.companySize || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
                <div className="company-description">
                    <label>Description</label>
                    <textarea
                        rows={5}
                        name="description"
                        value={user.description || ""}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                    />
                </div>
            </div>
            <div className="company-contact">
                <div className="heading">
                    <h2>Contact Information</h2>
                </div>
                <div className="contact-info">
                    <div className="group">
                        <label htmlFor="">Phone</label>
                        <input
                            type="text"
                            name="phone"
                            value={user.phone || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="group">
                        <label htmlFor="">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="group">
                        <label>City</label>
                        {isEditing ? (
                            <select
                                name="city"
                                value={user.city || ''}
                                onChange={handleInputChange}
                            >
                                {cities.map(city => (
                                    <option key={city.value} value={city.value}>
                                        {city.label}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <input
                                type="text"
                                name="city"
                                value={user.city || ''}
                                disabled
                            />
                        )}
                    </div>
                    <div className="group">
                        <label htmlFor="">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={user.address || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
            </div>
            <div className="company-links">
                <div className="heading">
                    <h2>Social Media Links</h2>
                </div>
                <div className="social-links">
                    <div className="group">
                        <label htmlFor="">Facebook</label>
                        <input
                            type="text"
                            name="facebook"
                            value={user.facebook || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="group">
                        <label htmlFor="">Twitter</label>
                        <input
                            type="text"
                            name="twitter"
                            value={user.twitter || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="group">
                        <label htmlFor="">LinkedIn</label>
                        <input
                            type="text"
                            name="linkedin"
                            value={user.linkedin || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                    <div className="group">
                        <label htmlFor="">Instagram</label>
                        <input
                            type="text"
                            name="instagram"
                            value={user.instagram || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
                    </div>
                </div>
            </div>
        </div >
    );
};

export default EmployerProfile;
