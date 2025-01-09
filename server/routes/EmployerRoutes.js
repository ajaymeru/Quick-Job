const express = require("express")
const { employerSignup, employerLogin, postJob, fetchmydetails, editEmployerDetails,
  fetchMyJobs, fetchapplicationsbyjob, deleteJob, editJob, fetchSingleJob, statistics, fetchApplicantById, fetchEmployeesWithPagination, verifyOTP, updateApplicantStatus } = require("../controller/EmployerController")
const { authenticateUser, authorizeRole } = require("../middleware/middleware");
const createStorage = require("../cloudinaryConfig")
const multer = require("multer");

const uploadFiles = (userType) => {
  const storage = createStorage(userType);  // Dynamically create storage for user type
  return multer({ storage }).fields([
    { name: "profileImage", maxCount: 1 },
    { name: "resume", maxCount: 1 },
  ]);
};

const router = express.Router()

router.post("/signup", employerSignup)
router.post("/login", employerLogin)
router.post("/verify-otp", verifyOTP)


router.post("/post", authenticateUser, authorizeRole("Employer"), postJob)
router.get("/fetchmydetails", authenticateUser, authorizeRole("Employer"), fetchmydetails)
router.put(
  "/editmydetails",
  authenticateUser,
  authorizeRole("Employer"),
  uploadFiles("Employer"),
  async (req, res) => {
    try {
      const { profileImage, resume } = req.files;

      // Assign the URLs from Cloudinary to req.body
      req.body.profileImage = profileImage ? profileImage[0].path : req.user.profileImage;  // Preserve if no new upload
      req.body.resume = resume ? resume[0].path : req.user.resume;  // Preserve if no new upload

      await editEmployerDetails(req, res);
    } catch (error) {
      res.status(500).json({ msg: "Error updating employer details", error: error.message });
    }
  }
);
router.get("/fetchmyjobs", authenticateUser, authorizeRole("Employer"), fetchMyJobs)
router.get("/fetchapplicationsbyjob/:jobId", authenticateUser, authorizeRole("Employer"), fetchapplicationsbyjob)
router.delete("/deletejob/:id", authenticateUser, authorizeRole("Employer"), deleteJob)
router.put("/editjob/:id", authenticateUser, authorizeRole("Employer"), editJob)
router.get("/fetchsinglejob/:id", authenticateUser, authorizeRole("Employer"), fetchSingleJob)
router.get("/statistics", authenticateUser, authorizeRole("Employer"), statistics)
router.get("/fetchApplicantById/:id", authenticateUser, authorizeRole("Employer"), fetchApplicantById)
router.get("/employees", authenticateUser, authorizeRole("Employer"), fetchEmployeesWithPagination)
router.patch("/update-applicant-status", authenticateUser, authorizeRole("Employer"), updateApplicantStatus)

module.exports = router;
