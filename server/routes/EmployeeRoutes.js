const express = require("express");
const { employeeSignup, employeeLogin, fetchJobs, fetchCompanies, fetchoneJOb, fetchoneCompany, applyJob, toggleSaveJob, fetchmydetails, toggleFollowCompany, getSavedJobs, editEmployeeDetails, verifyOTP, resetPasswordRequest, resetPassword,
    fetchEmployerImages, changePassword } = require("../controller/EmployeeController");
const { authenticateUser, authorizeRole } = require("../middleware/middleware")
const createStorage = require("../cloudinaryConfig")
const multer = require("multer");

const uploadFiles = (userType) => {
    const storage = createStorage(userType);
    return multer({ storage }).fields([
        { name: "profileImage", maxCount: 1 },
        { name: "resume", maxCount: 1 },
    ])
}
const router = express.Router();

router.post("/signup", employeeSignup);
router.post("/login", employeeLogin);
router.post("/verify-otp", verifyOTP)

router.post("/reset-password-request", resetPasswordRequest);
router.post("/reset-password", resetPassword);

router.get("/employer-images", fetchEmployerImages);

router.get("/mydetails", authenticateUser, authorizeRole("Employee"), fetchmydetails)
router.get("/jobs", authenticateUser, authorizeRole("Employee"), fetchJobs)
router.get("/companies", authenticateUser, authorizeRole("Employee"), fetchCompanies)
router.get("/job/:id", authenticateUser, authorizeRole("Employee"), fetchoneJOb)
router.get("/company/:id", authenticateUser, authorizeRole("Employee"), fetchoneCompany)
router.post("/apply/:jobId", authenticateUser, authorizeRole("Employee"), applyJob);
router.post("/toggle-save/:jobId", authenticateUser, authorizeRole("Employee"), toggleSaveJob);
router.post("/toggle-follow/:companyId", authenticateUser, authorizeRole("Employee"), toggleFollowCompany);
router.get("/saved-jobs", authenticateUser, authorizeRole("Employee"), getSavedJobs)
router.put("/editemployeedetails",
    authenticateUser,
    authorizeRole("Employee"),
    uploadFiles("Employee"),
    editEmployeeDetails
);

module.exports = router;


