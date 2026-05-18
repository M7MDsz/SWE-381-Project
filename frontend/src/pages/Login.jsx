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
    <div className="auth-card mx-auto card card-body shadow-sm">
      <h2>Sign in</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <label className="form-label">Email</label>
        <input className="form-control mb-3" name="email" type="email" value={formData.email} onChange={handleChange} required />
        <label className="form-label">Password</label>
        <input className="form-control mb-3" name="password" type="password" value={formData.password} onChange={handleChange} required />
        <button className="btn btn-success w-100" type="submit">Sign in</button>
      </form>
      <p className="mt-3 mb-0">No account? <Link to="/register">Register</Link></p>
    </div>
  );
}

export default Login;
