import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import CameraDisplay from './Security/SecurityPanel'; 
import './Admin.css'; 
import UserList from './Userliit/Userlist';
import CompaniesAd from './Companies/companies';
import BookingsPanel from "./Bookings panel/bookingspanel";
import Analytics from "./Analytics/analytics";
const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('UserList');
  const [isVerified, setIsVerified] = useState(true); // Set to true by default

  const handleVerificationSuccess = () => {
    setIsVerified(true);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'Security':
        return isVerified ? 
          <h2 className="text-2xl font-bold">Security Panel</h2> : 
          <CameraDisplay onSuccess={handleVerificationSuccess} />;
      case 'UserList':
        return <UserList />;
      case 'Bookings':
        return <BookingsPanel />;
      case 'Companies':
        return <CompaniesAd />;
      case 'Verify Users':
        return <h2 className="text-2xl font-bold">Verify Users Panel</h2>;
      case 'Analytics':
        return <Analytics/>;
      default:
        return <UserList />;
    }
  };

  const Sidebar = () => {
    return (
      <div className="sidebar bg-white shadow-lg w-64 h-full overflow-y-auto">
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
            <div className="logo-container">
              <img src="/images/SWIFT_SAIL_9.png" alt="Logo" className="logo" />
            </div>
              <button 
                onClick={() => {
                  setSelectedTab('UserList');
                  setIsVerified(true);
                }} 
                className={`w-full text-left p-2 rounded ${selectedTab === 'UserList' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              >
                Users List
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setSelectedTab('Bookings');
                  setIsVerified(true);
                }} 
                className={`w-full text-left p-2 rounded ${selectedTab === 'Bookings' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              >
                Bookings
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setSelectedTab('Companies');
                  setIsVerified(true);
                }} 
                className={`w-full text-left p-2 rounded ${selectedTab === 'Companies' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              >
                Companies
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setSelectedTab('Verify Users');
                  setIsVerified(true);
                }} 
                className={`w-full text-left p-2 rounded ${selectedTab === 'Verify Users' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              >
                Verify Users
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setSelectedTab('Analytics');
                  setIsVerified(true);
                }} 
                className={`w-full text-left p-2 rounded ${selectedTab === 'Analytics' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              >
                Analytics
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setSelectedTab('Security');
                  setIsVerified(false);
                }} 
                className={`w-full text-left p-2 rounded ${selectedTab === 'Security' ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'}`}
              >
                Security
              </button>
            </li>
          </ul>
        </nav>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;