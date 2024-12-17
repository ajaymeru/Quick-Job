const express = require("express");
const { employeeSignup, employeeLogin, fetchJobs, fetchCompanies } = require("../controller/EmployeeController");
const { authenticateUser, authorizeRole } = require("../middleware/middleware")

const router = express.Router();

router.post("/signup", employeeSignup);
router.post("/login", employeeLogin);

router.get("/jobs", authenticateUser, authorizeRole("Employee"), fetchJobs)
router.get("/companies", authenticateUser, authorizeRole("Employee"), fetchCompanies)

module.exports = router;
