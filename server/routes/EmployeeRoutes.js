    const express = require("express");
    const { employeeSignup, employeeLogin, fetchJobs, fetchCompanies, fetchoneJOb, fetchoneCompany, applyJob, toggleSaveJob, fetchmydetails, toggleFollowCompany } = require("../controller/EmployeeController");
    const { authenticateUser, authorizeRole } = require("../middleware/middleware")

    const router = express.Router();

    router.post("/signup", employeeSignup);
    router.post("/login", employeeLogin);

    router.get("/mydetails", authenticateUser, authorizeRole("Employee"), fetchmydetails)
    router.get("/jobs", authenticateUser, authorizeRole("Employee"), fetchJobs)
    router.get("/companies", authenticateUser, authorizeRole("Employee"), fetchCompanies)
    router.get("/job/:id", authenticateUser, authorizeRole("Employee"), fetchoneJOb)
    router.get("/company/:id", authenticateUser, authorizeRole("Employee"), fetchoneCompany)
    router.post("/apply/:jobId", authenticateUser, authorizeRole("Employee"), applyJob);
    router.post("/toggle-save/:jobId", authenticateUser, authorizeRole("Employee"), toggleSaveJob);
    router.post("/toggle-follow/:companyId", authenticateUser, authorizeRole("Employee"), toggleFollowCompany);


    module.exports = router;
