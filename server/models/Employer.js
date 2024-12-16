const mongoose = require("mongoose");

const EmployerSchema = new mongoose.Schema(
  {
    comapanyname: {
      type: String,
      required: true,
    },
    address: {
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
    industry: {
      type: String,
      required: true,
    },
    companySize: {
      type: String, // Example: "1-10", "11-50", "51-200", etc.
      required: false,
    },
    website: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      default: "Employer",
    },
    description: {
      type: String, 
      required: false,
    },
    establishedDate: {
      type: Date,
      required: false,
    },
    password:{
        type:String,
        required:true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employer", EmployerSchema);
