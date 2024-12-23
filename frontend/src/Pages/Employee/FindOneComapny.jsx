import React, { useEffect, useState } from 'react'
import "../../Styles/FindOneComapny.scss"
import { useParams } from 'react-router-dom'
import axios from 'axios'

const FindOneComapny = () => {
    const { id } = useParams()
    const SERVER_URL = import.meta.env.VITE_SERVER_URL
    const [company, setCompany] = useState(null)

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const token = localStorage.getItem("token")
                if (!token) {
                    console.log("No token Found");
                    return;
                }
                const url = `${SERVER_URL}api/employee/company/${id}`
                const response = await axios.get(url, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const data = response.data.company
                console.log(data);
                setCompany(data)
            }catch(error){
                console.log("Error in fetching company", error.msg)
            }
        }
        fetchCompany()
    }, [id])

    return (
        <div className='FindOneComapny'>
            <h1>Company Details</h1>
            {company ? (
                <div className="company-details">
                    <p><strong>Company Name:</strong> {company.comapanyname}</p>
                    <p><strong>Address:</strong> {company.address}</p>
                    <p><strong>Email:</strong> {company.email}</p>
                    <p><strong>Phone:</strong> {company.phone}</p>
                    <p><strong>Industry:</strong> {company.industry}</p>
                    <p><strong>Company Size:</strong> {company.companySize}</p>
                    <p><strong>Website:</strong> <a href={company.website} target="_blank" rel="noopener noreferrer">{company.website}</a></p>
                    <p><strong>Role:</strong> {company.role}</p>
                    <p><strong>Description:</strong> {company.description}</p>

                </div>
            ) : (
                <p>Loading company details...</p>
            )}
        </div>
    )
}

export default FindOneComapny