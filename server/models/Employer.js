const mongoose = require("mongoose");

const EmployerSchema = new mongoose.Schema(
  {
    companyname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    website: {
      type: String,
      required: false,
    },
    establishedDate: {
      type: Date,
      required: false,
    },
    industry: {
      type: String,
      // required: true,
    },
    companySize: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },

    phone: {
      type: String,
      required: true,
    },
    city:{
      type: String,
      // required: true,
    },
    address: {
      type: String,
      required: true,
    },

    linkedin: {
      type: String,
      required: false,
    },
    facebook: {
      type: String,
      required: false,
    },
    twitter: {
      type: String,
      required: false,
    },
    instagram: {
      type: String,
      required: false,
    },
   
    role: {
      type: String,
      default: "Employer",
    },
    password: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employer", EmployerSchema);
