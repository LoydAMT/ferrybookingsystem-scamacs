import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import './UserList.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Simulating an API call to fetch users
    setTimeout(() => {
      const mockUsers = [
        { id: 1, firstName: 'Name', lastName: 'Name', nationality: 'Filipino', birthDate: '01/02/2000', gender: 'Male', contactNumber: '+639123123123', email: 'scamacs@gmail.com' },
        { id: 2, firstName: 'Name', lastName: 'Name', nationality: 'Filipino', birthDate: '01/02/2000', gender: 'Female', contactNumber: '+639123123123', email: 'scamacs@gmail.com' },
        // Add more mock users as needed
      ];
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredUsers = users.filter(user =>
    Object.values(user).some(value => 
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="user-list-container">
      <div className="search-bar">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Nationality</th>
              <th>Birth Date</th>
              <th>Gender</th>
              <th>Contact Number</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id}>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.nationality}</td>
                <td>{user.birthDate}</td>
                <td>{user.gender}</td>
                <td>{user.contactNumber}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserList;

