import React, { useEffect, useState, useCallback, useMemo } from 'react';
import UserList from '../src/components/UserList';
import './App.css';

const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true);
  const [sortColumn, setSortColumn] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [filters, setFilters] = useState({
    gender: 'all',
    country: 'all', 
  });

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`https://dummyjson.com/users?limit=10&skip=${(page - 1) * 10}`);
      const data = await response.json();

      // To check if it's the initial load or a subsequent page load
      if (page === 1) {
        setUsers(data.users);
      } else {
        setUsers((prevUsers) => [
          ...prevUsers, 
          ...data.users.map((u, idx) => ({ ...u, id: idx + 1 + ((page - 1) * 10) }))
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [page]);

  // Load users initially and when page changes
  useEffect(() => {
    if (initialLoad || page > 1) {
      loadUsers();
    }
  }, [page, loadUsers, initialLoad]);

  // Set up scroll event listener to load more users when reaching the bottom of the page
  useEffect(() => {
    const handleScroll = () => {
      if (Math.floor(window.innerHeight + document.documentElement.scrollTop) >= document.documentElement.offsetHeight - 5) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortOrder('asc');
    }

    const sortedUsers = [...users].sort((a, b) => {
      if (a[column] < b[column]) return -1;
      if (a[column] > b[column]) return 1;
      return 0;
    });
    setUsers(sortedUsers);
  };

  // Memoized processed user list based on filters and sorting
  const processedUserList = useMemo(() => {
    let filteredUsers = [...users];

    if (filters.gender !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.gender.toLowerCase() === filters.gender);
    }
    if (filters.country !== 'all') {
      filteredUsers = filteredUsers.filter(user => user.address.country === filters.country);
    }

    if (sortColumn) {
      filteredUsers = filteredUsers.sort((a, b) => {
        if (sortColumn === 'id') {
          return sortOrder === 'asc' ? a.id - b.id : b.id - a.id;
        }
        if (sortColumn === 'fullName') {
          return sortOrder === 'asc'
            ? a.firstName.toLowerCase().localeCompare(b.firstName.toLowerCase())
            : b.firstName.toLowerCase().localeCompare(a.firstName.toLowerCase());
        }
        return 0;
      });
    }

    return filteredUsers;
  }, [users, sortColumn, sortOrder, filters]);

  const handleFilters = (newFilters) => {
    setFilters((prevFilters) => ({ ...prevFilters, ...newFilters }));
  };

  return (
    <div>
      <div className="user-list-header">
        <h1>Employees</h1>
        <div className="filters">
          <div className="dropdown">
            <select className="one" onChange={(e) => handleFilters({ gender: e.target.value })} value={filters.gender}>
              <option value="all">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="dropdown">
            <select className="two" onChange={(e) => handleFilters({ country: e.target.value })} value={filters.country}>
              <option value="all">All Countries</option>
              <option value="United States">United States</option>
              <option value="India">India</option>
            </select>
          </div>
        </div>
      </div>
      <UserList users={processedUserList} onSort={handleSort} onFilters={handleFilters} />
      {loading && <div className="loader">Loading...</div>}
    </div>
  );
};

export default App;
