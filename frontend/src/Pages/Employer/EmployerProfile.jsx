import React, { useState, useEffect } from 'react';
import "../../Styles/EmployerProfile.scss";
import axios from 'axios';

const EmployerProfile = () => {
    const SERVER_URL = import.meta.env.VITE_SERVER_URL;
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [cities, setCities] = useState([]);
    const [message, setMessage] = useState('');

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

    const handleEditSave = async () => {
        if (isEditing) {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found");
                    return;
                }

                const response = await axios.put(`${SERVER_URL}api/employer/editmydetails`, user, {
                    headers: {
                        Authorization: `Bearer ${token}`,
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
                        <label htmlFor="">Your Email</label>
                        <input
                            type="email"
                            name="email"
                            value={user.email || ""}
                            onChange={handleInputChange}
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
                        <input
                            type="text"
                            name="industry"
                            value={user.industry || ""}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                        />
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
