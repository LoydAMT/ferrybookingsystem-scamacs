import React, { useState } from 'react';
import { Globe, User, LogOut } from 'lucide-react';
import CameraDisplay from './SecurityPanel'; // Import Security Panel Component

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('Bookings'); // Default is 'Bookings'
  const [isVerified, setIsVerified] = useState(false); // State to track verification

  // Sidebar Button Component with onClick Event
  const SidebarButton = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick}  // Handle button clicks
      className={`w-full text-left p-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800'}`}
    >
      {label}
    </button>
  );

  // Handle successful face verification
  const handleVerificationSuccess = () => {
    setIsVerified(true);
  };

  // Render content dynamically based on the selected tab
  const renderContent = () => {
    if (!isVerified) {
      return <CameraDisplay onSuccess={handleVerificationSuccess} />; // Show Security Panel until verified
    }

    switch (selectedTab) {
      case 'Security':
        return <CameraDisplay onSuccess={handleVerificationSuccess} />; // Security Panel for Face Scan
      case 'Bookings':
        return <h2 className="text-2xl font-bold">Bookings Panel</h2>;
      case 'Users List':
        return <h2 className="text-2xl font-bold">Users List Panel</h2>;
      // You can add more cases for other tabs
      default:
        return <h2 className="text-2xl font-bold">Select a Panel</h2>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Booking List</h1>
          <div className="space-y-2">
            <SidebarButton
              label="Users List"
              isActive={selectedTab === 'Users List'}
              onClick={() => setSelectedTab('Users List')}  // Change tab to "Users List"
            />
            <SidebarButton
              label="Bookings"
              isActive={selectedTab === 'Bookings'}
              onClick={() => setSelectedTab('Bookings')}  // Change tab to "Bookings"
            />
            <SidebarButton
              label="Security"
              isActive={selectedTab === 'Security'}
              onClick={() => setSelectedTab('Security')}  // Change tab to "Security"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{selectedTab} Panel</h2>
          <div className="flex items-center space-x-4">
            <Globe size={24} />
            <User size={24} />
            <button className="bg-blue-500 text-white px-4 py-2 rounded flex items-center">
              <LogOut size={18} className="mr-2" />
              Log Out
            </button>
          </div>
        </div>

        {/* Dynamic Content */}
        {renderContent()}  {/* Dynamically render the content based on the active tab */}
      </div>
    </div>
  );
};

export default Dashboard;
