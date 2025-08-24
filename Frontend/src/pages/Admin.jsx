import { useEffect, useState } from 'react';
import API from '../api';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resStats = await API.get('/admin/stats');
        const resUsers = await API.get('/admin/users');
        const resStores = await API.get('/admin/stores');
        setStats(resStats.data);
        setUsers(resUsers.data);
        setStores(resStores.data);
      } catch (error) {
        console.error('Error loading admin data', error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Admin Dashboard</h2>
      <div className="d-flex gap-3 mt-3">
        <div className="card p-3">
          <h5>Total Users</h5>
          <p>{stats.users}</p>
        </div>
        <div className="card p-3">
          <h5>Total Stores</h5>
          <p>{stats.stores}</p>
        </div>
        <div className="card p-3">
          <h5>Total Ratings</h5>
          <p>{stats.ratings}</p>
        </div>
      </div>

      <h3 className="mt-4">Users</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="mt-4">Stores</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Average Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{s.avgRating || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        className="btn btn-danger mt-3"
        onClick={() => {
          localStorage.clear();
          navigate('/');
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Admin;
