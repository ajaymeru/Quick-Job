const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employer = require("../models/Employer");
const Job = require("../models/jobschema")

const employerSignup = async (req, res) => {
  const { companyname, address, email, phone,  password, companySize, website, establishedDate } = req.body;

  try {
    // Check if employer already exists
    const existingEmployer = await Employer.findOne({ email });
    if (existingEmployer) {
      return res.status(400).json({ msg: "Employer already exists" });
    }

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
    });

    await newEmployer.save();
    const token = jwt.sign({ id: newEmployer._id, role: newEmployer.role }, process.env.SECRET_KEY, { expiresIn: "10h" });

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
    // Find employer by email
    const employer = await Employer.findOne({ email });
    if (!employer) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    // Generate JWT
    const token = jwt.sign({ id: employer._id, role: employer.role }, process.env.SECRET_KEY, {
      expiresIn: "10h",
    });

    // Respond with token and employer details
    res.json({
      token,
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
}

const editEmployerDetails = async (req, res) => {
  const { companyname, address, email, phone, industry, companySize, website, description, establishedDate, city, linkedin, facebook, twitter, instagram } = req.body;

  try {
    const employer = await Employer.findById(req.user.id);
    if (!employer) {
      return res.status(404).json({ msg: "Employer not found" });
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
}

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
    const job = await Job.findById(jobId).populate("applicants");
    if (!job) {
      return res.status(404).json({ msg: "Job not found" });
    }

    if (!job.applicants || job.applicants.length === 0) {
      return res.status(404).json({ msg: "No applications found for this job" });
    }

    res.status(200).json({ msg: "Applications fetched successfully", applications: job.applicants });
  } catch (error) {
    res.status(500).json({ msg: "Error fetching applications", error: error.message });
  }
};



module.exports = {
  employerSignup, employerLogin, postJob, fetchmydetails,
  editEmployerDetails, fetchMyJobs, fetchapplicationsbyjob, deleteJob,
  editJob, fetchSingleJob,
};
