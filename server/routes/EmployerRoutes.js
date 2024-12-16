const express = require("express")
const { employerSignup, employerLogin } = require("../controller/EmployerController")

const router = express.Router()

router.post("/signup", employerSignup)
router.post("/login", employerLogin)

module.exports = router;
