import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Signup.scss";
import OTPPopup from "./OTPPopup";

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
      companyname: "",
      address: "",
      companySize: "",
      website: "",
      establishedDate: "",
    }),
  });

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState("");


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

      // navigate(role === "employee" ? "/employee" : "/employer");
      // window.location.reload();
      setUserId(response.data.employee?.id || response.data.employer?.id);
      setIsPopupVisible(true);
    } catch (error) {
      console.error(error);
      alert("Registration failed. Please try again.");
    }
  };

  const handleVerifyOTP = async () => {
    const endpoint =
      role === "employee"
        ? "http://localhost:5000/api/employee/verify-otp"
        : "http://localhost:5000/api/employer/verify-otp";
    try {
      const response = await axios.post(endpoint, { id: userId, otp });
      alert("OTP verified successfully!");
      setIsPopupVisible(false);
      navigate(role === "employee" ? "/employee" : "/employer");
    } catch (error) {
      console.error(error);
      alert("OTP verification failed. Please try again.");
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
              name="companyname"
              placeholder="Company Name"
              value={formData.companyname}
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
      <OTPPopup
        isVisible={isPopupVisible}
        otp={otp}
        setOtp={setOtp}
        onVerify={handleVerifyOTP}
        onClose={() => setIsPopupVisible(false)}
      />
    </div>
  );
};

export default Signup;
