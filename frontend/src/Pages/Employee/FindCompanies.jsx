import React, { useEffect, useState } from "react";
import "../../Styles/FindCompanies.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import notfound from "../../assets/notfound.png";
import Select from "react-select";



const FindCompanies = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [filters, setFilters] = useState({
    companyname: "",
    industry: "",
    city: [],
  });
  const [sortOption, setSortOption] = useState("")
  const [followCompanies, setFollowCompanies] = useState([]);
  const [cities, setCities] = useState([]);

  const industry = [
    "IT Services & Consulting",
    "Software Product",
    "Internet",
    "Electronics Manufacturing",
    "Electronic Components / Semiconductors",
    "Hardware & Networking",
    "Emerging Technologies",
    "Medical Services / Hospital",
    "Pharmaceutical & Life Sciences",
    "Medical Devices & Equipment",
    "Biotechnology",
    "Clinical Research / Contract Research",
    "Industrial Equipment / Machinery",
    "Auto Components",
    "Chemicals",
    "Automobile",
    "Electrical Equipment",
    "Building Material",
    "Industrial Automation",
    "Iron & Steel",
    "Metals & Mining",
    "Packaging & Containers",
    "Petrochemical / Plastics / Rubber",
    "Defence & Aerospace",
    "Fertilizers / Pesticides / Agro chemicals",
    "Pulp & Paper",
    "Education / Training",
    "E-Learning / EdTech",
    "Engineering & Construction",
    "Real Estate",
    "Courier / Logistics",
    "Power",
    "Oil & Gas",
    "Water Treatment / Waste Management",
    "Aviation",
    "Ports & Shipping",
    "Urban Transport",
    "Railways",
    "Financial Services",
    "FinTech / Payments",
    "Insurance",
    "NBFC",
    "Banking",
    "Investment Banking / Venture Capital / Private Equity",
    "Recruitment / Staffing",
    "Management Consulting",
    "Accounting / Auditing",
    "Facility Management Services",
    "Architecture / Interior Design",
    "Legal",
    "Design",
    "Law Enforcement / Security Services",
    "Content Development / Language",
    "Advertising & Marketing",
    "Telecom / ISP",
    "Printing & Publishing",
    "Film / Music / Entertainment",
    "Gaming",
    "TV / Radio",
    "Animation & VFX",
    "Events / Live Entertainment",
    "Sports / Leisure & Recreation",
    "BPO / Call Centre",
    "Analytics / KPO / Research",
    "Textile & Apparel",
    "Retail",
    "Consumer Electronics & Appliances",
    "Food Processing",
    "FMCG",
    "Hotels & Restaurants",
    "Travel & Tourism",
    "Furniture & Furnishing",
    "Beauty & Personal Care",
    "Fitness & Wellness",
    "Gems & Jewellery",
    "Beverage",
    "Leather",
    "NGO / Social Services / Industry Associations",
    "Agriculture / Forestry / Fishing",
    "Import & Export",
    "Miscellaneous",
    "Government / Public Administration"
  ];


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

    const fetchCities = async () => {
      try {
        const response = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/cities",
          { country: "India" }
        );
        if (!response.data.error) {
          const cityOptions = response.data.data.map((city) => ({
            value: city,
            label: city,
          }));
          cityOptions.push({ value: "Remote", label: "Remote" });
          setCities(cityOptions);
        } else {
          console.error("Error fetching cities.");
        }
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchCompanies();
    fetchEmployeeDetails();
    fetchCities();
  }, [SERVER_URL]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleMultiSelectChange = (selectedOptions, fieldName) => {
    const selectedValues = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setFilters((prev) => ({
      ...prev,
      [fieldName]: selectedValues,
    }));
  };

  useEffect(() => {
    const applyFilters = () => {
      const filtered = companies.filter((company) => {
        const matchesName =
          !filters.companyname ||
          company.companyname
            .toLowerCase()
            .includes(filters.companyname.toLowerCase());

        const matchesIndustry =
          filters.industry.length === 0 ||
          filters.industry.includes(company.industry);

        const matchesCity =
          filters.city.length === 0 ||
          filters.city.some((city) =>
            company.city
              ? company.city.toLowerCase() === city.toLowerCase()
              : city === "Remote"
          );

        return matchesName && matchesIndustry && matchesCity;
      });
      const sorted = sortCompanies(filtered);
      setFilteredCompanies(sorted);
    };


    applyFilters();
  }, [filters, companies, sortOption]);

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

  const industryOptions = industry.map((ind) => ({
    value: ind,
    label: ind,
  }));

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const sortCompanies = (companiesToSort) => {
    return [...companiesToSort].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (sortOption === "newest") {
        return dateB - dateA;
      } else if (sortOption === "oldest") {
        return dateA - dateB;
      }
      return 0;
    });
  };

  return (
    <div className="FindCompanies">
      <div className="search">
        <div className="filters">
          <div className="byCompanyname">
            <input
              type="text"
              name="companyname"
              placeholder="Enter company name"
              value={filters.companyname}
              onChange={handleFilterChange}
            />
          </div>
          <div className="industry">
            <Select
              isMulti
              name="industry"
              options={industryOptions}
              placeholder="Select industries"
              onChange={(selected) => handleMultiSelectChange(selected, "industry")}
            />
          </div>
          <div className="city">
            <Select
              isMulti
              name="city"
              options={cities}
              placeholder="Select cities"
              onChange={(selected) => handleMultiSelectChange(selected, "city")}
            />
          </div>
          <div className="sort">
            <select value={sortOption} onChange={handleSortChange}>
              <option value="">Sort By</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
        <div className="companies">
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <div key={company._id} className="companyCard">

                <div className="logo">
                  {company && company.profileImage ? (
                    <img src={company.profileImage} alt="" />
                  ) : (
                    <img src={notfound} alt="default logo" />
                  )}
                  <div className="company-info">
                    <h3>{company.companyname}</h3>
                    <button onClick={() => toggleFollowCompany(company._id)}>
                      <FontAwesomeIcon icon={followCompanies.includes(company._id) ? "" : faPlus} />{" "}
                      {followCompanies.includes(company._id) ? "Unfollow" : "Follow"}
                    </button>

                  </div>

                </div>
                <div className="industry-location">
                  <p>{company.industry || "N/A"}</p>
                  <p>{company.city || "N/A"}</p>
                </div>
                <button onClick={() => handleCompanyCardClick(company._id)}>
                  see more
                </button>
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
