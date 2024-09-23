import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
import CameraDisplay from './SecurityPanel'; 
import './Admin.css'; 
import UserList from './Userliit/Userlist';

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState('Bookings');
  const [isVerified, setIsVerified] = useState(false);

  const SidebarButton = ({ label, isActive, onClick }) => (
    <button
      onClick={onClick} 
      className={`w-full text-left p-2 rounded ${isActive ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-800'}`}
    >
      {label}
    </button>
  );

  const handleVerificationSuccess = () => {
    setIsVerified(true);
  };

  const renderContent = () => {
    if (!isVerified) {
      return <CameraDisplay onSuccess={handleVerificationSuccess} />;
    }
    switch (selectedTab) {
      case 'Security':
        return <CameraDisplay onSuccess={handleVerificationSuccess} />;
      case 'Bookings':
        return <h2 className="text-2xl font-bold">Bookings Panel</h2>;
      case 'Users List':
        return <h2 className="text-2xl font-bold">Users List Panel</h2>;
      default:
        return <h2 className="text-2xl font-bold">Select a Panel</h2>;
    }
  };

  const Sidebar = () => {
    return (
      <div className="sidebar bg-white shadow-lg w-64 h-full overflow-y-auto">
        <nav className="p-4">
          <ul className="space-y-2">
            <li><a href="/admin" className="block p-2 hover:bg-gray-100 rounded">UserList</a></li>
            <li><a href="/bookingsad" className="block p-2 hover:bg-gray-100 rounded">Bookings</a></li>
            <li><a href="/companiesad" className="block p-2 hover:bg-gray-100 rounded">Companies</a></li>
            <li><a href="/verifyusersad" className="block p-2 hover:bg-gray-100 rounded">Verify Users</a></li>
            <li><a href="/analyticsad" className="block p-2 hover:bg-gray-100 rounded">Analytics</a></li>
          </ul>
        </nav>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
          <LogOut size={18} className="mr-2" />
          Log Out
        </button>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          <h2 className="text-2xl font-bold mb-6">{selectedTab} Panel</h2>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;