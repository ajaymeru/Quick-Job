const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "Employee",
    },
    savejobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    }],
    followingEmployer: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employer",
    }],
}, { timestamps: true });

module.exports = mongoose.model("Employee", EmployeeSchema);
