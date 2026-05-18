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
    <div className="auth-card mx-auto card card-body shadow-sm">
      <h2>Create account</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label className="form-label">Name</label>
        <input className="form-control mb-3" name="name" value={formData.name} onChange={handleChange} required />
        <label className="form-label">Email</label>
        <input className="form-control mb-3" name="email" type="email" value={formData.email} onChange={handleChange} required />
        <label className="form-label">Password</label>
        <input className="form-control mb-3" name="password" type="password" value={formData.password} onChange={handleChange} required />
        <label className="form-label">Account type</label>
        <select className="form-select mb-3" name="role" value={formData.role} onChange={handleChange}>
          <option value="user">Match organizer</option>
          <option value="owner">Stadium owner</option>
        </select>
        <button className="btn btn-success w-100" type="submit">Register</button>
      </form>
      <p className="mt-3 mb-0">Already registered? <Link to="/login">Sign in</Link></p>
    </div>
  );
}

export default Register;
