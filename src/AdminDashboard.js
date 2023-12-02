import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_ENDPOINT = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    axios.get(API_ENDPOINT)
      .then(response => {
        setUsers(response.data);
        setFilteredUsers(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  useEffect(() => {
    const filtered = users.filter(user =>
      Object.values(user).some(value =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredUsers(filtered);
    setCurrentPage(1);
  }, [searchTerm, users]);

  const indexOfLastUser = currentPage * rowsPerPage;
  const indexOfFirstUser = indexOfLastUser - rowsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleSelectRow = (id) => {
    const selectedRowIds = new Set(selectedRows);
    if (selectedRowIds.has(id)) {
      selectedRowIds.delete(id);
    } else {
      selectedRowIds.add(id);
    }
    setSelectedRows(Array.from(selectedRowIds));
  };

  const deleteSelectedRows = () => {
    const updatedUsers = users.filter(user => !selectedRows.includes(user.id));
    setUsers(updatedUsers);
    setFilteredUsers(updatedUsers);
    setSelectedRows([]);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Select All</th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map(user => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(user.id)}
                  onChange={() => toggleSelectRow(user.id)}
                />
              </td>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button className="edit">Edit</button>
                <button className="delete">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={() => paginate(1)}>First Page</button>
        <button onClick={() => paginate(currentPage - 1)}>Previous Page</button>
        {[...Array(Math.ceil(filteredUsers.length / rowsPerPage)).keys()].map(number => (
          <button key={number + 1} onClick={() => paginate(number + 1)}>
            {number + 1}
          </button>
        ))}
        <button onClick={() => paginate(currentPage + 1)}>Next Page</button>
        <button onClick={() => paginate(Math.ceil(filteredUsers.length / rowsPerPage))}>
          Last Page
        </button>
      </div>
      <button className="delete" onClick={deleteSelectedRows}>
        Delete Selected
      </button>
    </div>
  );
}

export default AdminDashboard;
