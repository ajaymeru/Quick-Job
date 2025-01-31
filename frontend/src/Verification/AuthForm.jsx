import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../Styles/AuthForm.scss";
import OTPPopup from './OTPPopup';
import { FaBuilding, FaUserTie, FaEnvelope, FaLock, FaPhone, FaGlobe, FaEye, FaEyeSlash, FaUsers, FaMapMarkerAlt, FaKey } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AuthForm = () => {
    const navigate = useNavigate();
    const [isFlipped, setIsFlipped] = useState(false);
    const [isJobSeeker, setIsJobSeeker] = useState(true);
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [otp, setOtp] = useState("");
    const [userId, setUserId] = useState("");
    const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [resetOtp, setResetOtp] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        password: "",
        companyname: "",
        address: "",
        companySize: "",
        website: "",
    });

    const baseURL = "http://localhost:5000/api";
    const userType = isJobSeeker ? "employee" : "employer";

    const endpoints = {
        signup: `${baseURL}/${userType}/signup`,
        verifyOtp: `${baseURL}/${userType}/verify-otp`,
        login: `${baseURL}/${userType}/login`,
        resetPasswordRequest: `${baseURL}/${userType}/reset-password-request`,
        resetPassword: `${baseURL}/${userType}/reset-password`,
    };

    const handleFlip = () => setIsFlipped(prev => !prev);
    const handleRoleToggle = () => setIsJobSeeker(prev => !prev);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const endpoint = isFlipped ? endpoints.signup : endpoints.login;
        const payload = isFlipped ?
            { ...formData } :
            { email: formData.email, password: formData.password };

        try {
            const response = await axios.post(endpoint, payload);

            if (isFlipped) { // Signup flow
                setUserId(response.data.employee?.id || response.data.employer?.id);
                setIsPopupVisible(true);
                toast.success('Please check your email for OTP verification!');
            } else { // Login flow
                if (!response.data.isotpVerified) {
                    setUserId(response.data.employeeId || response.data.employerId);
                    setIsPopupVisible(true);
                    toast.info('Please verify your account with OTP!');
                    return;
                }
                localStorage.setItem("token", response.data.token);
                navigate(`/${userType}`);
                window.location.reload();
            }
        } catch (error) {
            console.error(error);
            toast.error(`Operation failed: ${error.response?.data?.message || error.message}`);
        }
    };

    const handleVerifyOTP = async () => {
        try {
            const response = await axios.post(endpoints.verifyOtp, { id: userId, otp });
            toast.success("OTP verified successfully!");
            setIsPopupVisible(false);

            if (!isFlipped) { // Login verification
                localStorage.setItem("token", response.data.token);
                navigate(`/${userType}`);
                window.location.reload();
            } else { // Signup verification
                handleFlip();
                setFormData({
                    firstname: "", lastname: "", email: "", phone: "", password: "",
                    companyname: "", address: "", companySize: "", website: ""
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("OTP verification failed!");
        }
    };

    const handleForgotPassword = async () => {
        try {
            // Try employee endpoint first
            let response = await axios.post(`${baseURL}/employee/reset-password-request`, { email: resetEmail });
            setUserId(response.data.userId);
            setIsForgotPasswordVisible(true);
            toast.success("OTP sent to your email for password reset.");
            setFormData(prev => ({ ...prev, userType: "employee" }));
        } catch (error1) {
            console.error("Employee reset request failed, trying employer...");
            try {
                // If employee endpoint fails, try employer endpoint
                let response = await axios.post(`${baseURL}/employer/reset-password-request`, { email: resetEmail });
                setUserId(response.data.userId);
                setIsForgotPasswordVisible(true);
                toast.success("OTP sent to your email for password reset.");
                setFormData(prev => ({ ...prev, userType: "employer" }));
            } catch (error2) {
                console.error(error2);
                toast.error("Email not found in either Employee or Employer records.");
            }
        }
    };

    const handleResetPassword = async () => {
        if (!formData.userType) {
            toast.error("User type not determined. Please request OTP again.");
            return;
        }

        try {
            const response = await axios.post(`${baseURL}/${formData.userType}/reset-password`, {
                email: resetEmail,
                otp: resetOtp,
                newPassword,
            });
            toast.success("Password reset successfully!");
            setIsForgotPasswordVisible(false);
        } catch (error) {
            console.error(error);
            toast.error("Error resetting password. Please check the OTP and try again.");
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    }

    return (
        <div className='AuthForm'>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <div className="auth-section">
                <div className={`card-wrapper ${isFlipped ? "flipped" : ""}`}>
                    {/* Login Card */}
                    <div className="card login-card">
                        <div className="role-toggle">
                            <div className={`toggle-switch ${!isJobSeeker ? 'company' : ''}`}>
                                <button onClick={handleRoleToggle}>
                                    {isJobSeeker ? <FaUserTie /> : <FaBuilding />}
                                </button>
                            </div>
                            <h4>{isJobSeeker ? 'Job Seeker Login' : 'Employer Login'}</h4>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>
                                    <FaEnvelope className="input-icon" />
                                    <input type="email" name="email"
                                        value={formData.email} onChange={handleChange}
                                        placeholder=' ' required />
                                    <span className="label">Email</span>
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <FaLock className="input-icon" />
                                    <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder=' ' required minLength={6} />
                                    <span className="label">Password</span>
                                    <span className='toggle-password' onClick={togglePasswordVisibility}> {showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                                </label>
                            </div>
                            <button type="submit" className="submit">
                                <span>Login</span>
                                <div className="hover-effect"></div>
                            </button>
                        </form>

                        <div className="auth-footer">
                            <a href="#" className="link" onClick={() => setIsForgotPasswordVisible(true)}>Forgot password?</a>
                            <span onClick={handleFlip} className="toggle-link">
                                New here? <strong>Create Account</strong>
                            </span>
                        </div>
                    </div>

                    {/* Signup Card */}
                    <div className="card signup-card">
                        <div className="role-toggle">
                            <div className={`toggle-switch ${!isJobSeeker ? 'company' : ''}`}>
                                <button onClick={handleRoleToggle}>
                                    {isJobSeeker ? <FaUserTie /> : <FaBuilding />}
                                </button>
                            </div>
                            <h4>{isJobSeeker ? 'Job Seeker Signup' : 'Employer Signup'}</h4>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {isJobSeeker ? (
                                <>
                                    <div className="form-group dual-input">
                                        <label>
                                            <FaUserTie className="input-icon" />
                                            <input type="text" name="firstname"
                                                value={formData.firstname} onChange={handleChange}
                                                placeholder=' ' required />
                                            <span className="label">First Name</span>
                                        </label>
                                        <label>
                                            <FaUserTie className="input-icon" />
                                            <input type="text" name="lastname"
                                                value={formData.lastname} onChange={handleChange}
                                                placeholder=' ' required />
                                            <span className="label">Last Name</span>
                                        </label>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label>
                                            <FaBuilding className="input-icon" />
                                            <input type="text" name="companyname"
                                                value={formData.companyname} onChange={handleChange}
                                                placeholder=' ' required />
                                            <span className="label">Company Name</span>
                                        </label>
                                    </div>
                                    <div className="form-group dual-input">
                                        <label>
                                            <FaMapMarkerAlt className="input-icon" />
                                            <input type="text" name="address"
                                                value={formData.address} onChange={handleChange}
                                                placeholder=' ' required />
                                            <span className="label">Address</span>
                                        </label>
                                        <label>
                                            <FaUsers className="input-icon" />
                                            <input type="text" name="companySize"
                                                value={formData.companySize} onChange={handleChange}
                                                placeholder=' ' />
                                            <span className="label">Company Size</span>
                                        </label>
                                    </div>
                                    <div className="form-group">
                                        <label>
                                            <FaGlobe className="input-icon" />
                                            <input type="url" name="website"
                                                value={formData.website} onChange={handleChange}
                                                placeholder=' ' />
                                            <span className="label">Website</span>
                                        </label>
                                    </div>
                                </>
                            )}

                            <div className="form-group dual-input">
                                <label>
                                    <FaEnvelope className="input-icon" />
                                    <input type="email" name="email"
                                        value={formData.email} onChange={handleChange}
                                        placeholder=' ' required />
                                    <span className="label">Email</span>
                                </label>
                                <label>
                                    <FaPhone className="input-icon" />
                                    <input type="tel" name="phone"
                                        value={formData.phone} onChange={handleChange}
                                        placeholder=' ' required />
                                    <span className="label">Phone</span>
                                </label>
                            </div>
                            <div className="form-group">
                                <label>
                                    <FaLock className="input-icon" />
                                    <input type="password" name="password"
                                        value={formData.password} onChange={handleChange}
                                        placeholder=' ' required />
                                    <span className="label">Password</span>
                                </label>
                            </div>
                            <button type="submit" className="submit">
                                <span>Create Account</span>
                                <div className="hover-effect"></div>
                            </button>
                        </form>

                        <div className="auth-footer">
                            <span onClick={handleFlip} className="toggle-link">
                                Already registered? <strong>Login Here</strong>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <OTPPopup
                isVisible={isPopupVisible}
                otp={otp}
                setOtp={setOtp}
                onVerify={handleVerifyOTP}
                onClose={() => setIsPopupVisible(false)}
            />

            {isForgotPasswordVisible && (
                <div className="forgot-password-modal">
                    <div className="modal-content">
                        <h3>Forgot Password</h3>
                        <div className="form-group">
                            <label>
                                <FaEnvelope className="input-icon" />
                                <input type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} placeholder="Enter your email" required />
                            </label>
                        </div>
                        <button onClick={handleForgotPassword}>Send OTP</button>

                        {userId && (
                            <>
                                <div className="form-group">
                                    <label>
                                        <FaKey className="input-icon" />
                                        <input type="text" value={resetOtp} onChange={(e) => setResetOtp(e.target.value)} placeholder="Enter OTP" required />
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label>
                                        <FaLock className="input-icon" />
                                        <input type={showPassword ? "text" : "password"} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Enter new password" required minLength={6} />
                                        <span className='toggle-password' onClick={togglePasswordVisibility}> {showPassword ? <FaEyeSlash /> : <FaEye />}</span>
                                    </label>
                                </div>
                                <button onClick={handleResetPassword}>Reset Password</button>
                            </>
                        )}
                        <button onClick={() => setIsForgotPasswordVisible(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuthForm;