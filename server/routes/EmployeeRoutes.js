const express = require("express");
const { employeeSignup, employeeLogin } = require("../controller/EmployeeController");

const router = express.Router();

// Employee Signup
router.post("/signup", employeeSignup);

// Employee Login
router.post("/login", employeeLogin);

module.exports = router;
