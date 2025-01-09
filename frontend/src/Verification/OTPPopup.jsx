import React from "react";
import "../Styles/Popup.scss"

const OTPPopup = ({ isVisible, otp, setOtp, onVerify, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Verify OTP</h3>
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button onClick={onVerify}>Verify OTP</button>
        <button className="close-btn" onClick={onClose}>Skip</button>
      </div>
    </div>
  );
};

export default OTPPopup;
