import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { getFirestore, collection, addDoc, getDocs} from 'firebase/firestore';
import './Userlist.css';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const db = getFirestore();
        const usersCollection = collection(db, 'users'); 
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(userList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
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
              <th>District</th>
              <th>Birthday</th>
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
                <td>{user.district}</td>
                <td>{`${user.birthMonth ? user.birthMonth : ''} ${user.birthDay ? user.birthDay : ''},
                 ${user.birthdYear ? user.birthdYear : ''}`}</td>
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

