const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminSignup = async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await Admin.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "Email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newAdmin = new Admin({
            email,
            password: hashedPassword,
        });
        await newAdmin.save();
        const token = jwt.sign({ id: newAdmin._id }, process.env.SECRET_KEY, { expiresIn: "10h" });

        res.status(201).json({
            msg: "Admin created successfully",
            token,
            admin: {
                id: newAdmin._id,
                email: newAdmin.email,
                role: newAdmin.role,
            },
        });
    } catch (error) {
        res.status(500).json({ msg: "Error creating admin", error: error.message });
    }
};

const adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).json({ msg: "Invalid email" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid password" });
        }

        const token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY, {
            expiresIn: "10h",
        });

        res.json({
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                role: admin.role,
            },
        });
    } catch (error) {
        res.status(500).json({ msg: "Error logging in", error: error.message });
    }
};

module.exports = { adminSignup, adminLogin };
