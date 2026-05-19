import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success app-navbar shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">⚽ Soccer Player</Link>
        <div className="navbar-nav ms-auto align-items-lg-center">
          <Link className="nav-link" to="/">Search</Link>
          {user && user.role === 'owner' && <Link className="nav-link" to="/owner">Owner Dashboard</Link>}
          {user && <Link className="nav-link" to="/reservations">Reservations</Link>}
          {user && <Link className="nav-link" to="/messages">Messages</Link>}
          {!user && <Link className="nav-link" to="/login">Login</Link>}
          {!user && <Link className="nav-link" to="/register">Register</Link>}
          {user && <button className="btn btn-outline-light btn-sm ms-lg-2 mt-2 mt-lg-0" onClick={handleLogout}>Sign out</button>}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
