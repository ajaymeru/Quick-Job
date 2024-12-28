import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Styles/Login.scss";

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        role: "employee", 
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
            formData.role === "employee"
                ? "http://localhost:5000/api/employee/login"
                : "http://localhost:5000/api/employer/login";

        try {
            const response = await axios.post(endpoint, {
                email: formData.email,
                password: formData.password,
            });

            alert(`${formData.role === "employee" ? "Jobseeker" : "Company"} logged in successfully!`);

            localStorage.setItem("token", response.data.token)

            navigate(formData.role === "employee" ? "/employee" : "/employer");
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert("Login failed. Please check your credentials.");
        }
    };

    return (
        <div className="login">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
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

                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="employee"
                            checked={formData.role === "employee"}
                            onChange={handleChange}
                        />
                        Jobseeker
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="role"
                            value="employer"
                            checked={formData.role === "employer"}
                            onChange={handleChange}
                        />
                        Company
                    </label>
                </div>

                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
