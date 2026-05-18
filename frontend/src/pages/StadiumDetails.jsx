import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SlotBadge from '../components/SlotBadge';
import { AuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function StadiumDetails() {
  const { user, authFetch } = useContext(AuthContext);
  const [stadium, setStadium] = useState(null);
  const [slots, setSlots] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const stadiumId = window.location.pathname.split('/').pop();

  const loadDetails = async () => {
    try {
      const stadiumResponse = await fetch(`${API_URL}/stadiums/${stadiumId}`);
      const stadiumData = await stadiumResponse.json();
      if (!stadiumResponse.ok) throw new Error(stadiumData.message || 'Could not load stadium');
      setStadium(stadiumData);

      const slotResponse = await fetch(`${API_URL}/stadiums/${stadiumId}/slots`);
      const slotData = await slotResponse.json();
      if (!slotResponse.ok) throw new Error(slotData.message || 'Could not load slots');
      setSlots(slotData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadDetails();
  }, []);

  const handleReserve = async (slotId) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    try {
      await authFetch('/reservations', {
        method: 'POST',
        body: JSON.stringify({ slotId })
      });
      setMessage('Reservation created successfully.');
      loadDetails();
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!stadium) return <p>Loading...</p>;

  return (
    <div>
      <Link to="/" className="btn btn-link ps-0">Back to search</Link>
      <div className="row g-4">
        <div className="col-md-7">
          <h2>{stadium.name}</h2>
          <p className="text-muted">{stadium.location}</p>
          <p>{stadium.description}</p>
          <h5>Facilities</h5>
          <ul>
            {stadium.facilities && stadium.facilities.map((facility) => <li key={facility}>{facility}</li>)}
          </ul>
          <p>Owner: {stadium.owner && stadium.owner.name}</p>
          {user && stadium.owner && user._id !== stadium.owner._id && (
            <Link className="btn btn-outline-success" to="/messages">Message owner</Link>
          )}
        </div>
        <div className="col-md-5">
          <div className="row g-2">
            {stadium.photos && stadium.photos.map((photo) => (
              <div className="col-6" key={photo}>
                <img src={photo} alt={stadium.name} className="img-fluid rounded stadium-photo" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <hr />
      <h3>Availability Schedule</h3>
      <p><span className="legend green"></span> Available <span className="legend red ms-3"></span> Reserved</p>
      {message && <div className="alert alert-success">{message}</div>}
      <div className="row g-3">
        {slots.map((slot) => (
          <div className="col-md-3" key={slot._id}>
            <SlotBadge slot={slot} onReserve={user && user.role === 'user' ? handleReserve : null} />
          </div>
        ))}
      </div>
      {slots.length === 0 && <p className="text-muted">No slots have been added yet.</p>}
    </div>
  );
}

export default StadiumDetails;
