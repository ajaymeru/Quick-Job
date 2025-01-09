const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
require("dotenv").config()

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_URL_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_URL_API_KEY, 
  api_secret: process.env.CLOUDINARY_URL_API_SECRET,
});

// Function to get folder based on user type (Employee or Employer)
const getFolder = (userType) => {
  if (userType === "Employee") {
    return "employees";  // Folder for employees
  } else if (userType === "Employer") {
    return "employers";  // Folder for employers
  }
  return "default"; // Default folder
};

// Create a CloudinaryStorage instance that will upload the files to the correct folder
const createStorage = (userType) => {
  return new CloudinaryStorage({
    cloudinary,
    params: (req, file) => ({
      folder: getFolder(userType),  // Set folder based on userType
      allowed_formats: ["jpg", "png", "jpeg", "pdf", "docx"],  // Allowed formats
      public_id: file.fieldname + "-" + req.user.id,  // Ensure file name is unique for each user
    }),
  });
};

module.exports = createStorage;
