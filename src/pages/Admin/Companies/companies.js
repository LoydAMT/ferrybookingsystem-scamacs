import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import './companies.css';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true); // Declare loading state
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      // Simulated API call
      const companyData = [
        { id: 1, name: 'Company A', imageUrl: '/images/7.jpg' },
        { id: 2, name: 'Company B', imageUrl: '/images/7435218.jpg' },
        { id: 3, name: 'Company C', imageUrl: '/images//7491711.jpg' },
        { id: 1, name: 'Company A', imageUrl: '/images/7.jpg' },
        { id: 2, name: 'Company B', imageUrl: '/images/7435218.jpg' },
        { id: 3, name: 'Company C', imageUrl: '/images//7491711.jpg' },   
        { id: 2, name: 'Company B', imageUrl: '/images/7435218.jpg' },
        { id: 3, name: 'Company C', imageUrl: '/images//7491711.jpg' },
        { id: 1, name: 'Company A', imageUrl: '/images/7.jpg' },
        { id: 3, name: 'Company C', imageUrl: '/images//7491711.jpg' },
        { id: 1, name: 'Company A', imageUrl: '/images/7.jpg' },
      ];
      setCompanies(companyData);
      setLoading(false);
    };
  
    fetchCompanies();
  }, []);

  return (
    <div className="companies-list-container">
      <div className="logo-container">
        <img src='/images/select ferry.png' alt="Logo" className="logo" />
        <div className="search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {loading ? (
        <p>Loading companies...</p>
      ) : (
        <div className="header"> 
          <h3>Partnered Companies</h3>
          <div className="companies-list">
            {companies
              .filter(company => 
                company.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(company => (
                <div key={company.id} className="company-item">
                  <img src={company.imageUrl} alt={company.name} />
                  <p>{company.name}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};
  
export default Companies;
