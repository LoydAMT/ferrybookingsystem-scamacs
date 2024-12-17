import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import CameraDisplay from './Security/SecurityPanel'; 
import './Admin.css'; 
import UserList from './Userliit/Userlist';
import CompaniesAd from './Companies/companies';
import BookingsPanel from "./Bookings panel/bookingspanel";
import Analytics from "./Analytics/analytics";
import TrackBooking from './TrackBooking/trackBooking';

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('UserList');
  const [isVerified, setIsVerified] = useState(true);

  const handleVerificationSuccess = () => {
    setIsVerified(true);
  };

  // Render content dynamically based on selected tab
  const renderContent = () => {
    switch (selectedTab) {
      case 'Security':
        return isVerified ? (
          <h2 className="text-2xl font-bold">Security Panel</h2>
        ) : (
          <CameraDisplay onSuccess={handleVerificationSuccess} />
        );
      case 'UserList':
        return <UserList />;
      case 'Bookings':
        return <BookingsPanel />;
      case 'Companies':
        return <CompaniesAd />;
      case 'UserBooking':
        return <TrackBooking />;
      case 'Analytics':
        return <Analytics />;
      default:
        return <UserList />;
    }
  };

  // Sidebar component
  const Sidebar = () => (
    <div className="sidebar bg-white shadow-lg w-64 h-full overflow-y-auto">
      <nav className="p-4">
        <div className="logo-container">
          <img src="/images/SWIFT_SAIL_9.png" alt="Logo" className="logo" />
        </div>
        <ul className="space-y-2">
          {[
            { name: 'Users List', tab: 'UserList' },
            { name: 'Bookings', tab: 'Bookings' },
            { name: 'Companies', tab: 'Companies' },
            { name:'List of Booking', tab: 'UserBooking' },
            { name: 'Analytics', tab: 'Analytics' },
            { name: 'Security', tab: 'Security', verify: true },
          ].map(({ name, tab, verify }) => (
            <li key={tab}>
              <button
                onClick={() => {
                  setSelectedTab(tab);
                  setIsVerified(verify ? false : true); // Only reset isVerified for Security tab
                }}
                className={`w-full text-left p-2 rounded ${
                  selectedTab === tab
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;
