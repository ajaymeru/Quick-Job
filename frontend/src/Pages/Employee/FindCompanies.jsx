import React, { useEffect, useState } from "react";
import "../../Styles/FindCompanies.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FindCompanies = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const navigate  = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [filters, setFilters] = useState({
    companyName: "",
    location: "",
    industry: "",
  });

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }

        const response = await axios.get(`${SERVER_URL}api/employee/companies`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedCompanies = response.data.companies;
        console.log(fetchedCompanies);
        setCompanies(fetchedCompanies);
        setFilteredCompanies(fetchedCompanies); // Initialize filtered companies
      } catch (error) {
        console.error("Error in fetching companies", error);
      }
    };

    fetchCompanies();
  }, [SERVER_URL]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Apply filters
  useEffect(() => {
    const applyFilters = () => {
      const filtered = companies.filter((company) => {
        return (
          (!filters.companyName ||
            company.comapanyname
              .toLowerCase()
              .includes(filters.companyName.toLowerCase())) &&
          (!filters.location ||
            company.address.toLowerCase().includes(filters.location.toLowerCase())) &&
          (!filters.industry ||
            company.industry.toLowerCase().includes(filters.industry.toLowerCase()))
        );
      });
      setFilteredCompanies(filtered);
    };

    applyFilters();
  }, [filters, companies]);

  const handlecompanycardclick = (id)=>{
    navigate(`/company/${id}`)
  }

  return (
    <div className="FindCompanies">
      <div className="heading">
        <h2>Find Companies</h2>
      </div>
      <div className="search">
        <div className="filters">
          <div className="byCompanyName">
            <input
              type="text"
              name="companyName"
              placeholder="Enter company name"
              value={filters.companyName}
              onChange={handleFilterChange}
            />
          </div>
          <div className="location">
            <input
              type="text"
              name="location"
              placeholder="Enter location"
              value={filters.location}
              onChange={handleFilterChange}
            />
          </div>
          <div className="companyType">
            <select
              name="industry"
              value={filters.industry}
              onChange={handleFilterChange}
            >
              <option value="">Select Company Type</option>
              <option value="IT">IT</option>
              <option value="Technology">Technology</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
            </select>
          </div>
        </div>
        <div className="companies">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <div key={company._id} className="companyCard" onClick={()=> handlecompanycardclick(company._id)}>
                <h3>{company.comapanyname}</h3>
                <p>
                  <strong>Email:</strong> {company.email}
                </p>
                <p>
                  <strong>Location:</strong> {company.address}
                </p>
                <p>
                  <strong>Industry:</strong> {company.industry}
                </p>
                <p>
                  <strong>Size:</strong> {company.companySize} employees
                </p>
                <p>
                  <strong>Website:</strong>{" "}
                  <a href={company.website} target="_blank" rel="noreferrer">
                    {company.website}
                  </a>
                </p>
              </div>
            ))
          ) : (
            <p>No companies match the selected filters.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindCompanies;
