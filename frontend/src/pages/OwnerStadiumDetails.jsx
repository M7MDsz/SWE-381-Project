import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SlotBadge from '../components/SlotBadge';
import { AuthContext } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function OwnerStadiumDetails() {
  const { authFetch } = useContext(AuthContext);
  const { stadiumId } = useParams();

  const [stadium, setStadium] = useState(null);
  const [slots, setSlots] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [slotForm, setSlotForm] = useState({
    date: '',
    startTime: '',
    endTime: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const sortSlots = (items) => {
    return [...items].sort((a, b) => {
      const first = new Date(`${a.date}T${a.startTime}`);
      const second = new Date(`${b.date}T${b.startTime}`);
      return first - second;
    });
  };

  const loadData = async () => {
    try {
      const stadiumResponse = await fetch(`${API_URL}/stadiums/${stadiumId}`);
      const stadiumData = await stadiumResponse.json();

      if (!stadiumResponse.ok) {
        throw new Error(stadiumData.message || 'Could not load stadium');
      }

      setStadium(stadiumData);

      const slotResponse = await fetch(`${API_URL}/stadiums/${stadiumId}/slots`);
      const slotData = await slotResponse.json();

      if (!slotResponse.ok) {
        throw new Error(slotData.message || 'Could not load slots');
      }

      setSlots(sortSlots(slotData));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [stadiumId]);

  const handleSlotChange = (e) => {
    setSlotForm({
      ...slotForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();

    try {
      await authFetch('/stadiums/slots', {
        method: 'POST',
        body: JSON.stringify({
          ...slotForm,
          stadiumId
        })
      });

      setSlotForm({
        date: '',
        startTime: '',
        endTime: ''
      });

      setShowModal(false);
      setMessage('Slot added successfully.');
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!stadium) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/owner" className="btn btn-link ps-0">
          ← Back to Dashboard
        </Link>

        <button className="btn btn-success" onClick={() => setShowModal(true)}>
          Add Slot
        </button>
      </div>

      <div className="card card-body shadow-sm mb-4">
        <h3 className="text-success mb-1">{stadium.name}</h3>

        <p className="mb-1">
          <strong>Location:</strong> {stadium.location}
        </p>

        <p className="mb-2">
          <strong>Description:</strong> {stadium.description}
        </p>

        {stadium.facilities && stadium.facilities.length > 0 && (
          <div>
            <strong>Facilities:</strong>

            <ul className="mb-0 mt-1">
              {stadium.facilities.map((facility) => (
                <li key={facility}>{facility}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {message && <div className="alert alert-success">{message}</div>}

      <h4>Reservation Slots</h4>

      <div className="row g-3">
        {slots.map((slot) => (
          <div className="col-md-3" key={slot._id}>
            <SlotBadge slot={slot} />
          </div>
        ))}
      </div>

      {slots.length === 0 && (
        <p className="text-muted">
          No slots yet. Click “Add Slot” to create one.
        </p>
      )}

      {showModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-panel card shadow-lg">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Add Reservation Slot</h4>

                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleCreateSlot}>
                <input
                  type="date"
                  className="form-control mb-2"
                  name="date"
                  value={slotForm.date}
                  onChange={handleSlotChange}
                  required
                />

                <input
                  type="time"
                  className="form-control mb-2"
                  name="startTime"
                  value={slotForm.startTime}
                  onChange={handleSlotChange}
                  required
                />

                <input
                  type="time"
                  className="form-control mb-3"
                  name="endTime"
                  value={slotForm.endTime}
                  onChange={handleSlotChange}
                  required
                />

                <button className="btn btn-success" type="submit">
                  Save Slot
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerStadiumDetails;
