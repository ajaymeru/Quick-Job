import React, { useEffect, useState } from "react";
import "../../Styles/FindCompanies.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faCheck } from "@fortawesome/free-solid-svg-icons";

const FindCompanies = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [filters, setFilters] = useState({
    companyName: "",
    location: "",
    industry: "",
  });
  const [followCompanies, setFollowCompanies] = useState([]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(`${SERVER_URL}api/employee/companies`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedCompanies = response.data.companies;
        setCompanies(fetchedCompanies);
        setFilteredCompanies(fetchedCompanies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    const fetchEmployeeDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(`${SERVER_URL}api/employee/mydetails`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const employee = response.data.employee;
        setFollowCompanies(employee.followingEmployer || []);
      } catch (error) {
        console.error("Error fetching employee details:", error);
      }
    };

    fetchCompanies();
    fetchEmployeeDetails();
  }, [SERVER_URL]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

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

  const handleCompanyCardClick = (id) => {
    navigate(`/company/${id}`);
  };

  const toggleFollowCompany = async (companyId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        `${SERVER_URL}api/employee/toggle-follow/${companyId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedFollowingCompanies = response.data.followingCompanies;
      setFollowCompanies(updatedFollowingCompanies);
    } catch (error) {
      console.error("Error toggling follow for company:", error);
    }
  };

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
              <div key={company._id} className="companyCard">
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
                <div>
                  <button onClick={() => handleCompanyCardClick(company._id)}>
                    View
                  </button>
                  <button onClick={() => toggleFollowCompany(company._id)}>
                    <FontAwesomeIcon icon={followCompanies.includes(company._id) ? "" : faPlus} />{" "}
                    {followCompanies.includes(company._id) ? "Unfollow" : "Follow"}
                  </button>
                </div>
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
