import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Signup.scss";

const Signup = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const role = new URLSearchParams(location.search).get("role");

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    ...(role === "employer" && {
      comapanyname: "",
      address: "",
      industry: "",
      companySize: "",
      website: "",
      description: "",
      establishedDate: "",
    }),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const endpoint =
      role === "employee"
        ? "http://localhost:5000/api/employee/signup"
        : "http://localhost:5000/api/employer/signup";

    try {
      const response = await axios.post(endpoint, formData);
      alert(`${role === "employee" ? "Employee" : "Employer"} registered successfully!`);

      navigate(role === "employee" ? "/employee" : "/employer");
    } catch (error) {
      console.error(error);
      alert("Registration failed. Please try again.");
    }
  };

  return (
    <div className="signup">
      <h2>{role === "employee" ? "Employee Signup" : "Employer Signup"}</h2>
      <form onSubmit={handleSubmit}>
        {role === "employee" && (
          <>
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              value={formData.firstname}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              value={formData.lastname}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        {role === "employer" && (
          <>
            <input
              type="text"
              name="comapanyname"
              placeholder="Company Name"
              value={formData.comapanyname}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="industry"
              placeholder="Industry"
              value={formData.industry}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="companySize"
              placeholder="Company Size (e.g., 1-10)"
              value={formData.companySize}
              onChange={handleChange}
            />
            <input
              type="url"
              name="website"
              placeholder="Website"
              value={formData.website}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Company Description"
              value={formData.description}
              onChange={handleChange}
            ></textarea>
            <input
              type="date"
              name="establishedDate"
              placeholder="Established Date"
              value={formData.establishedDate}
              onChange={handleChange}
            />
          </>
        )}
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Signup;
