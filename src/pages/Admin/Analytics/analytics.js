import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import './analytics.css';

const Analytics = () => {
    const [searchTerm, setSearchTerm] = useState('');
    return (
      <div>
        {/* Analytics Container */}
        <div className="analytics-container">
          <h2>Analytics</h2>
          <div className="logo-container">
                    <img src='/images/select ferry.png' alt="Logo" className="logo1" />

                    {/* search bar */}
                    <div className="search-bar1">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
          <div className="chart-container">
            <div className="chart">
              <div className="chart-background"></div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default Analytics;