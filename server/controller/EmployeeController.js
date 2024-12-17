const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const Employer = require("../models/Employer");
const Job = require("../models/jobschema")

const employeeSignup = async (req, res) => {
    const { firstname, lastname, email, phone, password } = req.body;

    try {
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ msg: "Employee already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newEmployee = new Employee({
            firstname,
            lastname,
            email,
            phone,
            password: hashedPassword,
        });
        await newEmployee.save();
        const token = jwt.sign({ id: newEmployee._id, role: newEmployee.role }, process.env.SECRET_KEY, { expiresIn: "10h" });

        res.status(201).json({
            msg: "Employee created successfully",
            token,
            employee: {
                id: newEmployee._id,
                firstname: newEmployee.firstname,
                lastname: newEmployee.lastname,
                email: newEmployee.email,
                role: newEmployee.role,
            },
        });
    }
    catch (error) {
        res.status(500).json({ msg: "Error registering employee", error: error.message });
    }
};

const employeeLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(400).json({ msg: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, employee.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid password" });
        }

        const token = jwt.sign({ id: employee._id, role: employee.role }, process.env.SECRET_KEY, {
            expiresIn: "10h",
        });

        res.json({
            token,
            employee: {
                id: employee._id,
                firstname: employee.firstname,
                lastname: employee.lastname,
                email: employee.email,
                phone: employee.phone,
                department: employee.department,
                position: employee.position,
                role: employee.role,
            },
        });
    } catch (error) {
        res.status(500).json({ msg: "Error logging in", error: error.message });
    }
};

// fetch jobs
const fetchJobs = async (req, res) => {
    try {
        const jobs = await Job.find()
        res.status(200).json({
            msg: "Jobs fetched successfully",
            jobs,
        })
    } catch (error) {
        res.status(500).json({ msg: "Error fetching jobs", error: error.message })
    }
}

// fetch companies
const fetchCompanies = async (req, res) => {
    try {
        const companies = await Employer.find()
        res.status(200).json({
            msg: "Companies fetched successfully",
            companies
        })
    } catch (error) {
        res.status(500).json({ msg: "Error fetching companies", error: error.message })
    }
}

module.exports = { employeeSignup, employeeLogin, fetchJobs, fetchCompanies };