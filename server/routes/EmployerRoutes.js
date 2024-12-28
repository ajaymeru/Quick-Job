const express = require("express")
const { employerSignup, employerLogin, postJob, fetchmydetails, editEmployerDetails,
    fetchMyJobs, fetchapplicationsbyjob, deleteJob, editJob, fetchSingleJob } = require("../controller/EmployerController")
const { authenticateUser, authorizeRole } = require("../middleware/middleware");

const router = express.Router()

router.post("/signup", employerSignup)
router.post("/login", employerLogin)

router.post("/post", authenticateUser, authorizeRole("Employer"), postJob)
router.get("/fetchmydetails", authenticateUser, authorizeRole("Employer"), fetchmydetails)
router.put("/editmydetails", authenticateUser, authorizeRole("Employer"), editEmployerDetails)
router.get("/fetchmyjobs", authenticateUser, authorizeRole("Employer"), fetchMyJobs)
router.get("/fetchapplicationsbyjob/:jobId", authenticateUser, authorizeRole("Employer"), fetchapplicationsbyjob)
router.delete("/deletejob/:id", authenticateUser, authorizeRole("Employer"), deleteJob)
router.put("/editjob/:id", authenticateUser, authorizeRole("Employer"), editJob)
router.get("/fetchsinglejob/:id", authenticateUser, authorizeRole("Employer"), fetchSingleJob)

module.exports = router;
