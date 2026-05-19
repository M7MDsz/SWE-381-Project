import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

function Reservations() {
  const { user, authFetch } = useContext(AuthContext);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const loadReservations = async () => {
    try {
      const data = await authFetch('/reservations/mine');
      setReservations(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleCancel = async (id) => {
    try {
      await authFetch(`/reservations/${id}/cancel`, { method: 'PUT' });
      setMessage('Reservation cancelled.');
      loadReservations();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Reservations</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      <div className="table-responsive">
        <table className="table table-bordered align-middle">
          <thead className="table-success">
            <tr>
              <th>Stadium</th>
              <th>Location</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>{user.role === 'owner' ? 'Organizer' : 'Owner'}</th>
              <th>Message ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation._id}>
                <td>{reservation.stadium && reservation.stadium.name}</td>
                <td>{reservation.stadium && reservation.stadium.location}</td>
                <td>{reservation.slot && reservation.slot.date}</td>
                <td>{reservation.slot && `${reservation.slot.startTime} - ${reservation.slot.endTime}`}</td>
                <td>{reservation.status}</td>
                <td>{user.role === 'owner' ? reservation.user && reservation.user.name : reservation.owner && reservation.owner.name}</td>
                <td><code>{user.role === 'owner' ? reservation.user && reservation.user._id : reservation.owner && reservation.owner._id}</code></td>
                <td>
                  {user.role === 'user' && reservation.status === 'active' && (
                    <button className="btn btn-sm btn-danger" onClick={() => handleCancel(reservation._id)}>Cancel</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Reservations;
