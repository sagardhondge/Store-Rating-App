import React, { useState } from 'react';
import API from '../api';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: '',
    role: 'USER' // default role
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Client-side validation
    if (formData.name.length < 3) {
      setMessage('Name must be at least 3 characters long');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setMessage('Please enter a valid email address');
      return;
    }
    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return;
    }

    try {
      const res = await API.post('/auth/signup', formData);
      setMessage(res.data.message || 'Signup successful');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="container mt-4" style={{ maxWidth: '500px' }}>
      <h2 className="mb-3">Signup</h2>
      {message && <div className="alert alert-info">{message}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            className="form-control"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        {/* Role Selector */}
        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-select"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="USER">User</option>
            <option value="OWNER">Owner</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Signup
        </button>
      </form>
    </div>
  );
};

export default Signup;
