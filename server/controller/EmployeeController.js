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
            expiresIn: "100h",
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

const fetchmydetails = async (req, res) => {
    try {
        const employee = await Employee.findById(req.user.id);
        if (!employee) {
            return res.status(404).json({ msg: "Employee not found" });
        }
        res.status(200).json({ msg: "Employee fetched successfully", employee });
    } catch (error) {
        res.status(500).json({ msg: "Error fetching details", error: error.message })
    }
}

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

const fetchoneJOb = async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }
        res.status(200).json({ msg: "Job fetched successfully", job })
    }
    catch (error) {
        res.status(500).json({ msg: "Error fetching job", error: error.message })
    }
}

const fetchoneCompany = async (req, res) => {
    try {
        const company = await Employer.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ msg: "Company not found" });
        }

        const jobs = await Job.find({ employerId: req.params.id });

        return res.status(200).json({ msg: "Company fetched successfully", company, jobs: jobs.length ? jobs : [], });
    } catch (error) {
        res.status(500).json({ msg: "Error fetching company", error: error.message, });
    }
};

const applyJob = async (req, res) => {
    const { jobId } = req.params
    const employeeId = req.user.id

    try {
        const job = await Job.findById(jobId)
        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }
        if (job.applicants.includes(employeeId)) {
            return res.status(400).json({ msg: "You have already applied for this job" })
        }
        job.applicants.push(employeeId)
        await job.save()
        res.status(200).json({ msg: "Job applied successfully", job })
    } catch (error) {
        res.status(500).json({ msg: "Error applying job", error: error.message })
    }
}

const toggleSaveJob = async (req, res) => {
    const { jobId } = req.params;
    const employeeId = req.user.id;

    try {
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ msg: "Employee not found" });
        }

        // Check if the job is already saved
        if (employee.savejobs.includes(jobId)) {
            // Remove job from savejobs
            employee.savejobs = employee.savejobs.filter((id) => id.toString() !== jobId);
            await employee.save();
            return res.status(200).json({ msg: "Job unsaved successfully", savedJobs: employee.savejobs });
        } else {
            // Add job to savejobs
            employee.savejobs.push(jobId);
            await employee.save();
            return res.status(200).json({ msg: "Job saved successfully", savedJobs: employee.savejobs });
        }
    } catch (error) {
        res.status(500).json({ msg: "Error saving job", error: error.message });
    }
};

const toggleFollowCompany = async (req, res) => {
    const { companyId } = req.params;
    const employeeId = req.user.id;
    try {
        const company = await Employer.findById(companyId);
        if (!company) {
            return res.status(404).json({ msg: "Company not found" });
        }
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ msg: "Employee not found" });
        }
        if (employee.followingEmployer.includes(companyId)) {
            employee.followingEmployer = employee.followingEmployer.filter((id) => id.toString() !== companyId);
            await employee.save();
            return res.status(200).json({ msg: "Company unfollowed successfully", followingCompanies: employee.followingEmployer });
        } else {
            employee.followingEmployer.push(companyId);
            await employee.save();
            return res.status(200).json({ msg: "Company followed successfully", followingCompanies: employee.followingEmployer });
        }
    } catch (error) {
        res.status(500).json({ msg: "Error following company", error: error.message });
    }
}



module.exports = { employeeSignup, employeeLogin, fetchJobs, fetchCompanies, fetchoneJOb, fetchoneCompany, applyJob, toggleSaveJob, fetchmydetails, toggleFollowCompany };