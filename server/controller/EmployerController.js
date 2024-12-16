const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Employer = require("../models/Employer");

const employerSignup = async (req, res) => {
  const { comapanyname, address, email, phone, industry, password, companySize, website, description, establishedDate } = req.body;

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
      comapanyname,
      address,
      email,
      phone,
      industry,
      password: hashedPassword,
      companySize,
      website,
      description,
      establishedDate,
    });

    await newEmployer.save();
    const token = jwt.sign({ id: newEmployer._id, role: newEmployer.role }, process.env.SECRET_KEY, { expiresIn: "10h" });

    res.status(201).json({
      msg: "Employer created successfully",
      token,
      employer: {
        id: newEmployer._id,
        comapanyname: newEmployer.comapanyname,
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

module.exports = { employerSignup, employerLogin };
