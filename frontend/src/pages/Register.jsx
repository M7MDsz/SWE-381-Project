import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Register() {
  const { register } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'user' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      window.location.href = '/';
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card mx-auto card border-0 shadow-lg">
        <div className="card-body p-4 p-md-5">
          <div className="auth-icon mb-3">🏟️</div>
          <span className="section-label">Join Soccer Player</span>
          <h2 className="fw-bold mb-2">Create your account</h2>
          <p className="text-muted mb-4">Register as a player or stadium owner and start organizing matches.</p>

          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <label className="form-label fw-semibold">Name</label>
            <div className="input-group input-group-modern mb-3">
              <span className="input-group-text">👤</span>
              <input className="form-control" name="name" placeholder="Your name" value={formData.name} onChange={handleChange} required />
            </div>

            <label className="form-label fw-semibold">Email</label>
            <div className="input-group input-group-modern mb-3">
              <span className="input-group-text">✉️</span>
              <input className="form-control" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            </div>

            <label className="form-label fw-semibold">Password</label>
            <div className="input-group input-group-modern mb-3">
              <span className="input-group-text">🔒</span>
              <input className="form-control" name="password" type="password" placeholder="Choose a password" value={formData.password} onChange={handleChange} required />
            </div>

            <label className="form-label fw-semibold">Account type</label>
            <div className="input-group input-group-modern mb-4">
              <span className="input-group-text">⚽</span>
              <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                <option value="user">Soccer player</option>
                <option value="owner">Stadium owner</option>
              </select>
            </div>

            <button className="btn btn-success btn-lg w-100 rounded-pill" type="submit">Create account</button>
          </form>

          <p className="mt-4 mb-0 text-center">Already registered? <Link to="/login">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
