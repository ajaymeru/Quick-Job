const mongoose = require("mongoose")

const JobSchema = new mongoose.Schema({
    jobtitle: {
        type: String,
        required: true
    },
    jobtype: {
        type: String,
        required: true
    },
    jobcategory: {
        type: String,
        required: true
    },
    salaryrange: {
        type: String,
        required: true
    },
    experiencelevel: {
        type: String,
        required: true
    },
    location: {
        type: [String],
        required: true
    },
    applicationdeadline: {
        type: Date,
        required: false
    },
    jobdescription: {
        type: String,
        // required: true
    },
    jobrequirements: {
        type: [String],
        required: true
    },
    jobresponsibilities: {
        type: [String], 
        // required: true
    },
    
    
    preferredqualifications: {
        type: [String], 
        // required: true
    },
    
    employerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employer",
        required: true
    },
    posteddate: {
        type: Date,
        default: Date.now
    },
   
    applicants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    }]
},
    { timestamps: true }
);
module.exports = mongoose.model("Job", JobSchema)