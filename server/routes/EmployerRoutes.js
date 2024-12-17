const express = require("express")
const { employerSignup, employerLogin, postJob } = require("../controller/EmployerController")
const { authenticateUser, authorizeRole } = require("../middleware/middleware");

const router = express.Router()

router.post("/signup", employerSignup)
router.post("/login", employerLogin)

router.post("/post", authenticateUser, authorizeRole("Employer"), postJob)


module.exports = router;
