const express = require("express");
const { employeeSignup, employeeLogin, fetchJobs, fetchCompanies, fetchoneJOb, fetchoneCompany } = require("../controller/EmployeeController");
const { authenticateUser, authorizeRole } = require("../middleware/middleware")

const router = express.Router();

router.post("/signup", employeeSignup);
router.post("/login", employeeLogin);

router.get("/jobs", authenticateUser, authorizeRole("Employee"), fetchJobs)
router.get("/companies", authenticateUser, authorizeRole("Employee"), fetchCompanies)
router.get("/job/:id", authenticateUser, authorizeRole("Employee"), fetchoneJOb)
router.get("/company/:id", authenticateUser, authorizeRole("Employee"), fetchoneCompany)

module.exports = router;
