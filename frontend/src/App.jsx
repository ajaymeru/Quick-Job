import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from "./Componets/Navbar.jsx";
import Footer from "./Componets/Footer.jsx";
import PreHome from "./Pages/PreHome/PreHome.jsx";
import Employer from "./Pages/Employer/Employer.jsx";
import Employee from "./Pages/Employee/Employee.jsx";
import Findjobs from "./Pages/Employee/Findjobs.jsx"
import FindCompanies from "./Pages/Employee/FindCompanies.jsx"
import Signup from "./Verification/Signup.jsx";
import Login from "./Verification/Login.jsx";
import FindOneJob from './Pages/Employee/FindOneJob.jsx';
import FindOneComapny from './Pages/Employee/FindOneComapny.jsx';
import EmployeeDashboard from './Pages/Employee/EmployeeDashboard.jsx';
import { getTokenAndRole } from './utils/authUtils.jsx';
import CvBuilder from './Pages/Employee/CvBuilder.jsx';

function App() {
  // const { token, role } = getTokenAndRole();
  const token = localStorage.getItem("token");
  let role = null;

  if (token) {
    try {
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      role = decodedToken?.role?.toLowerCase();
    } catch (error) {
      console.error("Invalid token", error);
      localStorage.removeItem("token");
    }
  }

  return (
    <div className="app">
      <Router>
        {(role === "employee" || role === null) && <Navbar />}
        <Routes>
          {!token && (
            <>
              <Route path="/" element={<PreHome />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}

          {token && role === "employee" && (
            <>
              <Route path="/" element={<Navigate to="/employee" />} />
              <Route path="/employee" element={<Employee />} />
              <Route path="/jobs" element={<Findjobs />} />
              <Route path="/job/:id" element={<FindOneJob />} />
              <Route path="/companies" element={<FindCompanies />} />
              <Route path="/company/:id" element={<FindOneComapny />} />
              <Route path="/dashboard/*" element={<EmployeeDashboard />} />
              <Route path="*" element={<Navigate to="/employee" />} />
            </>
          )}

          {token && role === "employer" && (
            <>
              <Route path="/employer/*" element={<Employer />} />
              <Route path="/*" element={<Navigate to="/employer/statistics" />} />
            </>
          )}
        </Routes>
        {(role === "employee" || role === null) && <Footer />}
      </Router>
    </div>
  );
}

export default App;
