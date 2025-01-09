const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");
const Employer = require("../models/Employer");
const Job = require("../models/jobschema");
const { generateOTP, sendEmail } = require("../utils/email");

const employeeSignup = async (req, res) => {
    const { firstname, lastname, email, phone, password } = req.body;

    try {
        const existingEmployee = await Employee.findOne({ email });
        if (existingEmployee) {
            return res.status(400).json({ msg: "Employee already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = generateOTP()
        const otpExpires = Date.now() + 10 * 60 * 1000;

        const newEmployee = new Employee({
            firstname,
            lastname,
            email,
            phone,
            password: hashedPassword,
            otp,
            otpExpires,
        });
        await newEmployee.save();

        await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}. It is valid for 10 minutes.`)
        console.log(email, otp)

        const token = jwt.sign({ id: newEmployee._id, role: newEmployee.role }, process.env.SECRET_KEY, { expiresIn: "100h" });

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
        console.log("Received email:", email);
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(400).json({ msg: "Invalid email" });
        }
        if (!employee.isotpVerified) {
            const otp = generateOTP();
            employee.otp = otp;
            employee.otpExpires = Date.now() + 10 * 60 * 1000;

            await employee.save();
            await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}. It is valid for 10 minutes.`);

            return res.status(200).json({  // Use 200 to simplify frontend handling
                msg: "OTP sent to your email. Please verify to proceed.",
                isotpVerified: false,
                employeeId: employee._id,
            });
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
            isotpVerified: true,  // Correctly return the OTP verification status
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

const verifyOTP = async (req, res) => {
    const { id, otp } = req.body;

    try {
        const user = await Employee.findById(id) || await Employer.findById(id);

        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Validate OTP and expiration
        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }

        user.isotpVerified = true;
        user.otp = null; // Clear OTP
        user.otpExpires = null;

        await user.save();

        res.json({ msg: "OTP verified successfully." });
    } catch (error) {
        res.status(500).json({ msg: "Error verifying OTP", error: error.message });
    }
};

const fetchJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate("employerId", "profileImage companyname")
        if (!jobs) {
            return res.status(404).json({ msg: "No jobs found" })
        }
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
            .populate("employerId", "companyname profileImage industry city description website");
        if (!job) {
            return res.status(404).json({ msg: "Job not found" });
        }

        // Fetch related jobs by matching jobrequirements
        const relatedJobs = await Job.find({
            _id: { $ne: job._id }, // Exclude the current job
            jobrequirements: { $in: job.jobrequirements } // Match jobrequirements
        })
            .limit(3)
            .populate("employerId", "companyname profileImage industry city");

        res.status(200).json({
            msg: "Job fetched successfully",
            job,
            relatedJobs
        });
    } catch (error) {
        res.status(500).json({ msg: "Error fetching job", error: error.message });
    }
};

const fetchoneCompany = async (req, res) => {
    try {
        const company = await Employer.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ msg: "Company not found" });
        }

        const jobs = await Job.find({ employerId: req.params.id });

        const followerCount = await Employee.countDocuments({ followingEmployer: req.params.id })

        return res.status(200).json({
            msg: "Company fetched successfully",
            company,
            jobs: jobs.length ? jobs : [],
            followersCount: followerCount,
        });
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

const getSavedJobs = async (req, res) => {
    const employeeId = req.user.id;

    try {
        const employee = await Employee.findById(employeeId);

        if (!employee) {
            return res.status(404).json({ msg: "Employee not found" });
        }

        const savedJobIds = employee.savejobs;
        const savedJobsDetails = await Job.find({ _id: { $in: savedJobIds } }).populate("employerId", "companyname profileImage")

        res.status(200).json({
            msg: "Saved jobs retrieved successfully",
            savedJobs: savedJobsDetails
        });
    } catch (error) {
        res.status(500).json({
            msg: "Error retrieving saved jobs",
            error: error.message
        });
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

const editEmployeeDetails = async (req, res) => {
    const {
        firstname,
        lastname,
        email,
        phone,
        resumeheadline,
        experience,
        education,
        skills,
        projects,
        socialLinks,
        location,
        yearsOfExperience,
    } = req.body;

    const employeeId = req.user.id;

    try {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ msg: "Employee not found" });
        }

        if (email && email !== employee.email) {
            const emailExists = await Employee.findOne({ email });
            if (emailExists) {
                return res.status(400).json({ msg: "Email is already in use" });
            }
        }

        if (req.files) {
            const { profileImage, resume } = req.files;
            req.body.profileImage = profileImage ? profileImage[0].path : employee.profileImage;
            req.body.resume = resume ? resume[0].path : employee.resume;
        }

        const parseIfString = (field) => {
            if (typeof field === "string") {
                try {
                    return JSON.parse(field);
                } catch (e) {
                    return field.split(",").map(skill => skill.trim()); z
                }
            }
            return field;
        };

        employee.firstname = firstname || employee.firstname;
        employee.lastname = lastname || employee.lastname;
        employee.email = email || employee.email;
        employee.phone = phone || employee.phone;
        employee.resumeheadline = resumeheadline || employee.resumeheadline;
        employee.location = location || employee.location;
        employee.yearsOfExperience = yearsOfExperience || employee.yearsOfExperience;
        employee.profileImage = req.body.profileImage || employee.profileImage;
        employee.resume = req.body.resume || employee.resume;
        employee.experience = parseIfString(experience) || employee.experience;
        employee.education = parseIfString(education) || employee.education;
        employee.skills = parseIfString(skills) || employee.skills;
        employee.projects = parseIfString(projects) || employee.projects;
        employee.socialLinks = parseIfString(socialLinks) || employee.socialLinks;

        await employee.save();

        res.status(200).json({ msg: "Employee details updated successfully", employee });
    } catch (error) {
        res.status(500).json({ msg: "Error editing employee details", error: error.message });
    }
};

const resetPasswordRequest = async (req, res) => {
    const { email } = req.body;
    try {
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(404).json({ msg: "Employee not found" });
        }
        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000;
        employee.otp = otp;
        employee.otpExpires = otpExpires;
        await employee.save();
        await sendEmail(email, "Password Reset OTP", `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`);
        res.status(200).json({ msg: "OTP sent for password reset", userId: employee._id });
    }
    catch (error) {
        res.status(500).json({ msg: "Error sending OTP for password reset", error: error.message });
    }
}

const resetPassword = async (req, res) => {
    const { id, otp, newPassword } = req.body;
    try {
        const employee = await Employee.findOne({ email });
        if (!employee) {
            return res.status(404).json({ msg: "Employee not found" });
        }
        if (employee.otp !== otp || employee.otpExpires < Date.now()) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        employee.password = hashedPassword;
        employee.otp = null; // Clear OTP
        employee.otpExpires = null;
        await employee.save();
        res.status(200).json({ msg: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Error resetting password", error: error.message });
    }
}

const changePassword = async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const employeeId = req.user.id;
    try {
        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return res.status(404).json({ msg: "Employee not found" });
        }
        const isMatch = await bcrypt.compare(oldPassword, employee.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Old password is incorrect" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        employee.password = hashedPassword;
        await employee.save();
        res.status(200).json({ msg: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Error changing password", error: error.message });
    }
}

module.exports = { editEmployeeDetails, employeeSignup, getSavedJobs, employeeLogin, fetchJobs, fetchCompanies, fetchoneJOb, fetchoneCompany, applyJob, toggleSaveJob, fetchmydetails, toggleFollowCompany, verifyOTP,resetPasswordRequest, resetPassword, changePassword };