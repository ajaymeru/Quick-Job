const express = require("express");
const cors = require("cors");
const connectDB = require("./Database/db");
const adminRoutes = require("./routes/Adminroutes")
const employeeRoutes = require("./routes/EmployeeRoutes");
const employerRoutes = require("./routes/EmployerRoutes")
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/admin", adminRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/employer", employerRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
