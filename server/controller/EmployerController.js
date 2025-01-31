const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employer = require("../models/Employer");
const Employee = require("../models/Employee")
const Job = require("../models/jobschema");
const { generateOTP, sendEmail } = require("../utils/email");

const employerSignup = async (req, res) => {
  const { companyname, address, email, phone, password, companySize, website, establishedDate } = req.body;

  try {
    // Check if employer already exists
    const existingEmployer = await Employer.findOne({ email });
    if (existingEmployer) {
      return res.status(400).json({ msg: "Employer already exists" });
    }

    const otp = generateOTP()
    const otpExpires = Date.now() + 10 * 60 * 1000;
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new employer
    const newEmployer = new Employer({
      email,
      phone,
      password: hashedPassword,
      companyname,
      address,
      companySize,
      website,
      establishedDate,
      otp,
      otpExpires,
    });

    await newEmployer.save();

    await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}. It is valid for 10 minutes.`);
    console.log(email, otp)

    const token = jwt.sign({ id: newEmployer._id, role: newEmployer.role }, process.env.SECRET_KEY, { expiresIn: "100h" });

    res.status(201).json({
      msg: "Employer created successfully",
      token,
      employer: {
        id: newEmployer._id,
        companyname: newEmployer.companyname,
        email: newEmployer.email,
        role: newEmployer.role,
      },
    });
  } catch (error) {
    res.status(500).json({ msg: "Error registering employer", error: error.message });
  }
};

const employerLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const employer = await Employer.findOne({ email });
    if (!employer) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    if (!employer.isotpVerified) {
      const otp = generateOTP();
      employer.otp = otp;
      employer.otpExpires = Date.now() + 10 * 60 * 1000;

      await employer.save();
      await sendEmail(email, "Your OTP Code", `Your OTP is ${otp}. It is valid for 10 minutes.`);
      console.log(email, otp)

      return res.status(200).json({
        msg: "OTP sent to your email. Please verify to proceed.",
        isotpVerified: false,
        employerId: employer._id,  // Use `employerId` for OTP verification
      });
    }

    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: employer._id, role: employer.role }, process.env.SECRET_KEY, {
      expiresIn: "100h",
    });
    // Respond with token and employer details
    res.json({
      token,
      isotpVerified: true,
      employer: {
        id: employer._id,
        name: employer.name,
        address: employer.address,
        email: employer.email,
        phone: employer.phone,
        industry: employer.industry,
        companySize: employer.companySize,
        website: employer.website,
        description: employer.description,
        establishedDate: employer.establishedDate,
        role: employer.role,
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

const resetPasswordRequest = async (req, res) => {
    const { email } = req.body;
    try {
        const employer = await Employer.findOne({ email });
        if (!employer) {
            return res.status(404).json({ msg: "Employer not found" });
        }
        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000;
        employer.otp = otp;
        employer.otpExpires = otpExpires;
        await employer.save();
        await sendEmail(email, "Password Reset OTP", `Your OTP for password reset is ${otp}. It is valid for 10 minutes.`);
        console.log(email, otp)
        res.status(200).json({ msg: "OTP sent for password reset", userId: employer._id });
    }
    catch (error) {
        res.status(500).json({ msg: "Error sending OTP for password reset", error: error.message });
    }
}

const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const employer = await Employer.findOne({ email });
        if (!employer) {
            return res.status(404).json({ msg: "Employer not found" });
        }
        if (employer.otp !== otp || employer.otpExpires < Date.now()) {
            return res.status(400).json({ msg: "Invalid or expired OTP" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        employer.password = hashedPassword;
        employer.otp = null; // Clear OTP
        employer.otpExpires = null;
        await employer.save();
        res.status(200).json({ msg: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ msg: "Error resetting password", error: error.message });
    }
}

const fetchmydetails = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user.id);
    if (!employer) {
      return res.status(404).json({ msg: "Employer not found" });
    }
    res.status(200).json({ msg: "Employee fetched successfully", employer });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching employer details", error: error.message });
  }
};

const editEmployerDetails = async (req, res) => {
  const { companyname, address, email, phone, industry, companySize, website, description, establishedDate, city, linkedin, facebook, twitter, instagram, profileImage } = req.body;

  try {
    const employer = await Employer.findById(req.user.id);
    if (!employer) {
      return res.status(404).json({ msg: "Employer not found" });
    }
    if (email && email !== employer.email) {
      const existingUser = await Employer.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ msg: "Email already exists" });
      }
    }

    employer.companyname = companyname || employer.companyname;
    employer.email = email || employer.email;
    employer.website = website || employer.website;
    employer.establishedDate = establishedDate || employer.establishedDate;
    employer.industry = industry || employer.industry;
    employer.companySize = companySize || employer.companySize;
    employer.description = description || employer.description;
    employer.phone = phone || employer.phone;
    employer.city = city || employer.city;
    employer.address = address || employer.address;
    employer.linkedin = linkedin || employer.linkedin;
    employer.facebook = facebook || employer.facebook;
    employer.twitter = twitter || employer.twitter;
    employer.instagram = instagram || employer.instagram;
    employer.profileImage = profileImage || employer.profileImage;

    await employer.save();

    res.status(200).json({ msg: "Employer details updated successfully", employer });
  } catch (error) {
    res.status(500).json({ msg: "Error updating employer details", error: error.message });
  }
};

const postJob = async (req, res) => {
  const { jobtitle,
    jobtype,
    jobcategory,
    jobdescription,
    jobrequirements,
    jobresponsibilities,
    salaryrange,
    experiencelevel,
    preferredqualifications, location, applicationdeadline } = req.body

  try {
    if (req.user.role !== "Employer") {
      return res.status(403).json({ msg: "Access denied. Only employers can post jobs." })
    }
    const newJob = new Job({
      jobtitle,
      jobtype,
      jobcategory,
      jobdescription,
      jobrequirements: jobrequirements.split(",").map((skill) => skill.trim()),
      jobresponsibilities: jobresponsibilities.split("\n").map((point) => point.trim()),
      salaryrange,
      experiencelevel,
      preferredqualifications: preferredqualifications.split("\n").map((point) => point.trim()),
      location,
      applicationdeadline,
      employerId: req.user.id,
    })
    await newJob.save()
    res.status(201).json({
      msg: "Job posted successfully",
      job: newJob,
    });
  }
  catch (error) {
    res.status(500).json({ msg: "Error posting job", error: error.message });
  }
};

const fetchSingleJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }
    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Access denied. You can only view your own jobs" });
    }
    res.status(200).json({ msg: "Job fetched successfully", job });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching job", error: error.message });
  }
};

const editJob = async (req, res) => {
  const jobId = req.params.id;
  const {
    jobtitle,
    jobtype,
    jobcategory,
    jobdescription,
    jobrequirements,
    jobresponsibilities,
    salaryrange,
    experiencelevel,
    preferredqualifications,
    location,
    applicationdeadline
  } = req.body;

  try {
    // Find the job by ID
    const job = await Job.findById(jobId);

    // Validate if job exists
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    // Ensure only the owner of the job can edit it
    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Access denied. You can only edit your own jobs." });
    }

    // Update job fields if provided in the request
    job.jobtitle = jobtitle || job.jobtitle;
    job.jobtype = jobtype || job.jobtype;
    job.jobcategory = jobcategory || job.jobcategory;
    job.jobdescription = jobdescription || job.jobdescription;

    // Safely parse and update job requirements
    if (jobrequirements) {
      job.jobrequirements = Array.isArray(jobrequirements)
        ? jobrequirements.map((req) => req.trim())
        : jobrequirements.split(",").map((req) => req.trim());
    }

    // Safely parse and update job responsibilities
    if (jobresponsibilities) {
      job.jobresponsibilities = Array.isArray(jobresponsibilities)
        ? jobresponsibilities.map((res) => res.trim())
        : jobresponsibilities.split("\n").map((res) => res.trim());
    }

    job.salaryrange = salaryrange || job.salaryrange;
    job.experiencelevel = experiencelevel || job.experiencelevel;

    // Safely parse and update preferred qualifications
    if (preferredqualifications) {
      job.preferredqualifications = Array.isArray(preferredqualifications)
        ? preferredqualifications.map((qual) => qual.trim())
        : preferredqualifications.split("\n").map((qual) => qual.trim());
    }

    // Update location if provided
    if (location) {
      job.location = Array.isArray(location) ? location : [location];
    }

    // Update application deadline
    if (applicationdeadline) {
      const deadline = new Date(applicationdeadline);
      if (isNaN(deadline.getTime())) {
        return res.status(400).json({ msg: "Invalid date format for application deadline" });
      }
      job.applicationdeadline = deadline;
    }

    // Save the updated job document
    await job.save();

    res.status(200).json({ msg: "Job updated successfully", job });
  } catch (error) {
    res.status(500).json({ msg: "Error updating job", error: error.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }
    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Access denied. You can only delete your own jobs" });
    }
    await Job.deleteOne({ _id: jobId });
    res.status(200).json({ msg: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Error deleting job", error: error.message });
  }
};

const fetchMyJobs = async (req, res) => {
  try {
    if (req.user.role !== "Employer") {
      return res.status(403).json({ msg: "Access denied. Only employers can fetch their jobs." });
    }

    const jobs = await Job.find({ employerId: req.user.id });
    if (!jobs) {
      return res.status(404).json({ msg: "No jobs found for this employer" });
    }

    res.status(200).json({ msg: "Jobs fetched successfully", jobs });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching jobs", error: error.message });
  }
};

const fetchapplicationsbyjob = async (req, res) => {
  try {
    if (req.user.role !== "Employer") {
      return res.status(403).json({ msg: "Access denied. Only employers can fetch applications." });
    }

    const jobId = req.params.jobId;
    const job = await Job.findById(jobId)
      .populate("applicants")
      .populate("wishlist")
      .populate("shortlisted")
      .populate("selected")
      .populate("rejected")
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    res.status(200).json({
      msg: "Applications fetched successfully",
      applications: {
        applicants: job.applicants,
        wishlist: job.wishlist,
        shortlisted: job.shortlisted,
        selected: job.selected,
        rejected: job.rejected,
      }
    });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching applications", error: error.message });
  }
};

const fetchApplicantById = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user.id);
    if (!employer) {
      return res.status(404).json({ msg: "Employer not found" });
    }

    const applicantId = req.params.id;

    const applicant = await Employee.findById(applicantId);
    if (!applicant) {
      return res.status(404).json({ msg: "Applicant not found" });
    }

    res.status(200).json({ msg: "Applicant fetched successfully", applicant });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching applicant", error: error.message });
  }
};

const statistics = async (req, res) => {
  try {
    const employer = await Employer.findById(req.user.id);
    if (!employer) {
      return res.status(404).json({ msg: "Employer not found" });
    }

    const totalJobscount = await Job.countDocuments({ employerId: req.user.id });

    const jobs = await Job.find({ employerId: req.user.id });
    
    // Initialize counters for applicants at different stages
    let totalApplicantsCount = 0;
    let wishlistCount = 0;
    let shortlistedCount = 0;
    let selectedCount = 0;
    let rejectedCount = 0;

    jobs.forEach(job => {
      // Count total applicants from all the stages (applicants, wishlist, shortlisted, selected, rejected)
      totalApplicantsCount += job.applicants.length + job.wishlist.length + job.shortlisted.length + job.selected.length + job.rejected.length;

      // Count applicants for each stage separately
      wishlistCount += job.wishlist.length;
      shortlistedCount += job.shortlisted.length;
      selectedCount += job.selected.length;
      rejectedCount += job.rejected.length;
    });

    const activeJobsCount = await Job.countDocuments({
      employerId: req.user.id,
      applicationdeadline: { $gte: new Date() },
    });

    const expiredJobs = await Job.countDocuments({
      employerId: req.user.id,
      applicationdeadline: { $lt: new Date() }
    });

    const followers = await Employee.countDocuments({ followingEmployer: req.user.id });

    const todayJobs = await Job.countDocuments({
      employerId: req.user.id,
      createdAt: {
        $gte: new Date().setHours(0, 0, 0, 0), // Start of today
        $lt: new Date().setHours(23, 59, 59, 999), // End of today
      },
    });

    res.status(200).json({
      msg: "Statistics fetched successfully",
      totalJobsCount: totalJobscount,
      totalApplicantsCount: totalApplicantsCount,
      wishlistCount: wishlistCount,
      shortlistedCount: shortlistedCount,
      selectedCount: selectedCount,
      rejectedCount: rejectedCount,
      activeJobsCount: activeJobsCount,
      expiredJobs: expiredJobs,
      followers: followers,
      todayJobs: todayJobs,
    });
  } catch (error) {
    return res.status(500).json({ msg: "Error fetching employer", error: error.message });
  }
};

const fetchEmployeesWithPagination = async (req, res) => {
  try {
    // Get filter and pagination parameters from query
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchName = req.query.searchName || '';
    const skills = req.query.skills || '';
    const location = req.query.location || [];
    const yearsOfExperience = req.query.yearsOfExperience || '';
    const sort = req.query.sort || 'yearsOfExperience'; // Default to sorting by yearsOfExperience
    const sortOrder = req.query.sortOrder || 'asc'; // Default to ascending order

    const startIndex = (page - 1) * limit;

    // Construct the filter query
    const filterQuery = {
      ...(searchName && { $or: [{ firstname: { $regex: searchName, $options: 'i' } }, { lastname: { $regex: searchName, $options: 'i' } }] }),
      ...(skills && { skills: { $regex: skills, $options: 'i' } }),
      ...(location.length > 0 && { location: { $in: location } }), // Multiple locations filter
      ...(yearsOfExperience && { yearsOfExperience: { $lte: parseInt(yearsOfExperience, 10) } }), // Less than or equal to experience filter
    };

    // Determine sort direction
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    // Fetch employees with pagination and filtering
    const employees = await Employee.find(filterQuery)
      .skip(startIndex)
      .limit(limit)
      .sort({ [sort]: sortDirection, createdAt: -1 }); // Sort by the given field (yearsOfExperience by default)

    // Get total count of employees for metadata
    const totalEmployees = await Employee.countDocuments(filterQuery);

    // Calculate total pages
    const totalPages = Math.ceil(totalEmployees / limit);

    res.status(200).json({
      msg: "Employees fetched successfully",
      metadata: {
        totalEmployees,
        totalPages,
        currentPage: page,
        limit,
      },
      employees,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching employees", error: error.message });
  }
};

const updateApplicantStatus = async (req, res) => {
  try {
    const { jobId, employeeId, action } = req.body;

    const employer = await Employer.findById(req.user.id);
    if (!employer) {
      return res.status(404).json({ msg: "Employer not found" });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    if (job.employerId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Access denied. You can only manage applicants for your own jobs." });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ msg: "Employee not found" });
    }

    const validActions = ["wishlist", "shortlisted", "selected", "rejected"];
    if (!validActions.includes(action)) {
      return res.status(400).json({ msg: "Invalid action. Valid actions are: wishlist, shortlisted, selected, rejected." });
    }
    // Remove the employee from all categories
    job.applicants = job.applicants.filter((id) => id.toString() !== employeeId);
    job.wishlist = job.wishlist.filter((id) => id.toString() !== employeeId);
    job.shortlisted = job.shortlisted.filter((id) => id.toString() !== employeeId);
    job.selected = job.selected.filter((id) => id.toString() !== employeeId);
    job.rejected = job.rejected.filter((id) => id.toString() !== employeeId);
    // Add the employee to the appropriate category
    if (action === "wishlist") {
      job.wishlist.push(employeeId);
    } else if (action === "shortlisted") {
      job.shortlisted.push(employeeId);
    } else if (action === "selected") {
      job.selected.push(employeeId);
    } else if (action === "rejected") {
      job.rejected.push(employeeId);
    }
    // Save the updated job document
    await job.save();
    res.status(200).json({
      msg: `Employee moved to ${action} successfully`,
      job,
    });
  } catch (error) {
    res.status(500).json({ msg: "Error updating applicant status", error: error.message });
  }
};

module.exports = {
  employerSignup, employerLogin, postJob, fetchmydetails,
  editEmployerDetails, fetchMyJobs, fetchapplicationsbyjob, deleteJob,
  editJob, fetchSingleJob, statistics, fetchApplicantById, fetchEmployeesWithPagination, verifyOTP, 
  updateApplicantStatus, resetPasswordRequest, resetPassword,
};
