import React from 'react';
import './UserList.css';
import maleImage from '../assets/male.png';
import femaleImage from '../assets/female.png';
import sortArrow from '../assets/sortarrow.png';

const UserList = ({ users, onSort, onFilters }) => {
  // Function to handle sorting column click
  const handleSort = (column) => {
    onSort(column);
  };

  // Function to format gender for display
  const formatGender = (gender) => {
    return gender === 'male' ? 'M' : 'F';
  };

  return (
    <div className="user-list">
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('id')}>ID <img src={sortArrow} alt="Sort" className="sort-icon" /></th>
            <th>Image</th>
            <th onClick={() => handleSort('fullName')}>Full Name <img src={sortArrow} alt="Sort" className="sort-icon" /></th>
            <th>Demography</th>
            <th>Designation</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={user.id + '_' + idx}>
              <td>{user.id}</td>
              <td>
                <img src={user.gender === 'male' ? maleImage : femaleImage} alt="user" className="user-image" />
              </td>
              <td>{user.firstName} {user.maidenName} {user.lastName}</td>
              <td>{formatGender(user.gender)}/{user.age}</td>
              <td>{user.company.title}</td>
              <td>{user.address.state}, {user.address.country}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
