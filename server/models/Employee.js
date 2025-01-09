const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema(
    {
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
            // required: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            default: "Employee",
        },
        resumeheadline: {
            type: String,

        },
        profileImage: {
            type: String,
            required: false,
        },
        resume: {
            type: String,
        },
        experience: [
            {
                companyName: { type: String, },
                position: { type: String, },
                startDate: { type: Date, },
                endDate: { type: Date }, // Can be null for current job
                description: { type: String },
                location: { type: String, }
            },
        ],
        education: [
            {
                institution: { type: String, },
                degree: { type: String, },
                fieldOfStudy: { type: String },
                startDate: { type: Date, },
                endDate: { type: Date },
                location: { type: String, }
            },
        ],
        skills: {
            type: ["String"],
        },
        projects: [
            {
                title: { type: String, },
                description: { type: String },
                link: { type: String },
                technologies: [String],
            },
        ],
        socialLinks: {
            linkedIn: { type: String },
            github: { type: String },
            portfolio: { type: String },
            twitter: { type: String },
        },
        savejobs: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Job",
            },
        ],
        followingEmployer: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Employer",
            },
        ],
        location: {
            type: String,
        },
        yearsOfExperience: {
            type: Number,
        },
        otp: {
            type: String,
        },
        otpExpires: {
            type: Date,
        },
        isotpVerified: {
            type: Boolean,
            default: false,
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
