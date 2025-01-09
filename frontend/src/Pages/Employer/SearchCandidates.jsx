import React, { useEffect, useState } from 'react';
import "../../Styles/SearchCandidates.scss";
import axios from 'axios';
import Select from 'react-select'; // Assuming you're using react-select for multi-select

const SearchCandidates = () => {
  const SERVER_URL = import.meta.env.VITE_SERVER_URL;
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState([]);
  const [filteredCandidates, setFilteredCandidates] = useState([]);

  // Filter states
  const [searchName, setSearchName] = useState('');
  const [skills, setSkills] = useState('');
  const [selectedLocations, setSelectedLocations] = useState([]); // Multiple locations
  const [yearsOfExperience, setYearsOfExperience] = useState('');

  // Sorting state for experience
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }

        const response = await axios.get(`${SERVER_URL}api/employer/employees`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          params: {
            page: currentPage,
            limit: 10,
            searchName,
            skills,
            location: selectedLocations.map(loc => loc.value), 
            yearsOfExperience,
            sort: 'yearsOfExperience', // Sort by years of experience
            sortOrder: sortDirection, // Ascending or descending order
          },
        });

        setEmployees(response.data.employees);
        setTotalPages(response.data.metadata.totalPages);
        setFilteredCandidates(response.data.employees); 
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await axios.post('https://countriesnow.space/api/v0.1/countries/cities', { country: 'India' });
        if (!response.data.error) {
          const locationOptions = response.data.data.map(location => ({
            value: location,
            label: location
          }));
          setLocations(locationOptions);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchEmployees();
    fetchLocations();
  }, [currentPage, searchName, skills, selectedLocations, yearsOfExperience, sortDirection, SERVER_URL]);

  // Handle sorting by experience
  const handleSortExperience = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc'); // Toggle sort direction
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="SearchCandidates">
      <div className="filters">
        <input
          type="text"
          placeholder="Search By Name"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by Skill"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
        />
        <select
          name="yearsOfExperience"
          value={yearsOfExperience}
          onChange={(e) => setYearsOfExperience(e.target.value)}
        >
          <option value="">Select Experience</option>
          {Array.from({ length: 51 }, (_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>
        <Select
          isMulti
          options={locations}
          value={selectedLocations}
          onChange={(selectedOptions) => setSelectedLocations(selectedOptions)}
          placeholder="Select Locations"
        />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="employee-table">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Location</th>
              <th onClick={handleSortExperience} style={{ cursor: 'pointer' }}>
                Experience <i className={`fa-solid fa-sort ${sortDirection === 'asc' ? 'asc' : 'desc'}`} />
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredCandidates.map((employee, index) => (
              <tr key={employee._id}>
                <td>{(currentPage - 1) * 10 + index + 1}</td>
                <td>{employee.firstname} {employee.lastname}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.location}</td>
                <td>{employee.yearsOfExperience ? `${employee.yearsOfExperience} Years` : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="pagination">
        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SearchCandidates;
