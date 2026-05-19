import React from 'react';
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Login() {
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData);
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card mx-auto card border-0 shadow-lg">
        <div className="card-body p-4 p-md-5">
          <div className="auth-icon mb-3">⚽</div>
          <span className="section-label">Welcome back</span>
          <h2 className="fw-bold mb-2">Sign in to Soccer Player</h2>
          <p className="text-muted mb-4">Reserve stadiums, manage bookings, and continue your soccer plans.</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label className="form-label fw-semibold">Email</label>
            <div className="input-group input-group-modern mb-3">
              <span className="input-group-text">✉️</span>
              <input className="form-control" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            </div>

            <label className="form-label fw-semibold">Password</label>
            <div className="input-group input-group-modern mb-4">
              <span className="input-group-text">🔒</span>
              <input className="form-control" name="password" type="password" placeholder="Your password" value={formData.password} onChange={handleChange} required />
            </div>

            <button className="btn btn-success btn-lg w-100 rounded-pill" type="submit">⚽ Sign in</button>
          </form>

          <p className="mt-4 mb-0 text-center">No account? <Link to="/register">Create one</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Login;
