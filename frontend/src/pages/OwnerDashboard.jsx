import React from 'react';
import { useContext, useEffect, useState } from 'react';
import SlotBadge from '../components/SlotBadge';
import { AuthContext } from '../context/AuthContext';

function OwnerDashboard() {
  const { authFetch } = useContext(AuthContext);
  const [stadiums, setStadiums] = useState([]);
  const [selectedStadium, setSelectedStadium] = useState('');
  const [slots, setSlots] = useState([]);
  const [stats, setStats] = useState(null);
  const [stadiumForm, setStadiumForm] = useState({ name: '', description: '', location: '', photos: '', facilities: '' });
  const [slotForm, setSlotForm] = useState({ date: '', startTime: '', endTime: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadOwnerData = async () => {
    try {
      const ownerStadiums = await authFetch('/stadiums/mine');
      const ownerStats = await authFetch('/stadiums/stats');
      setStadiums(ownerStadiums);
      setStats(ownerStats);
      if (ownerStadiums.length > 0 && !selectedStadium) {
        setSelectedStadium(ownerStadiums[0]._id);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const loadSlots = async () => {
    if (!selectedStadium) return;
    try {
      const data = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/stadiums/${selectedStadium}/slots`);
      const slotData = await data.json();
      setSlots(slotData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadOwnerData();
  }, []);

  useEffect(() => {
    loadSlots();
  }, [selectedStadium]);

  const handleStadiumChange = (e) => {
    setStadiumForm({ ...stadiumForm, [e.target.name]: e.target.value });
  };

  const handleSlotChange = (e) => {
    setSlotForm({ ...slotForm, [e.target.name]: e.target.value });
  };

  const handleCreateStadium = async (e) => {
    e.preventDefault();
    try {
      await authFetch('/stadiums', {
        method: 'POST',
        body: JSON.stringify({
          ...stadiumForm,
          photos: stadiumForm.photos.split(',').map((item) => item.trim()).filter(Boolean),
          facilities: stadiumForm.facilities.split(',').map((item) => item.trim()).filter(Boolean)
        })
      });
      setStadiumForm({ name: '', description: '', location: '', photos: '', facilities: '' });
      setMessage('Stadium added successfully.');
      loadOwnerData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    try {
      await authFetch('/stadiums/slots', {
        method: 'POST',
        body: JSON.stringify({ ...slotForm, stadiumId: selectedStadium })
      });
      setSlotForm({ date: '', startTime: '', endTime: '' });
      setMessage('Slot added successfully.');
      loadSlots();
      loadOwnerData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Owner Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      {stats && (
        <div className="row g-3 mb-4">
          <div className="col-md-3"><div className="stat-card">Stadiums <strong>{stats.totalStadiums}</strong></div></div>
          <div className="col-md-3"><div className="stat-card">Total Slots <strong>{stats.totalSlots}</strong></div></div>
          <div className="col-md-3"><div className="stat-card">Reserved <strong>{stats.reservedSlots}</strong></div></div>
          <div className="col-md-3"><div className="stat-card">Available <strong>{stats.availableSlots}</strong></div></div>
        </div>
      )}

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card card-body shadow-sm">
            <h4>Add New Stadium</h4>
            <form onSubmit={handleCreateStadium}>
              <input className="form-control mb-2" name="name" placeholder="Stadium name" value={stadiumForm.name} onChange={handleStadiumChange} required />
              <input className="form-control mb-2" name="location" placeholder="Location" value={stadiumForm.location} onChange={handleStadiumChange} required />
              <textarea className="form-control mb-2" name="description" placeholder="Description" value={stadiumForm.description} onChange={handleStadiumChange} required />
              <input className="form-control mb-2" name="photos" placeholder="Photo URLs separated by commas" value={stadiumForm.photos} onChange={handleStadiumChange} />
              <input className="form-control mb-2" name="facilities" placeholder="Facilities separated by commas" value={stadiumForm.facilities} onChange={handleStadiumChange} />
              <button className="btn btn-success" type="submit">Add Stadium</button>
            </form>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card card-body shadow-sm">
            <h4>Add Reservation Slot</h4>
            <form onSubmit={handleCreateSlot}>
              <select className="form-select mb-2" value={selectedStadium} onChange={(e) => setSelectedStadium(e.target.value)} required>
                <option value="">Choose stadium</option>
                {stadiums.map((stadium) => <option key={stadium._id} value={stadium._id}>{stadium.name}</option>)}
              </select>
              <input type="date" className="form-control mb-2" name="date" value={slotForm.date} onChange={handleSlotChange} required />
              <input type="time" className="form-control mb-2" name="startTime" value={slotForm.startTime} onChange={handleSlotChange} required />
              <input type="time" className="form-control mb-2" name="endTime" value={slotForm.endTime} onChange={handleSlotChange} required />
              <button className="btn btn-success" type="submit">Add Slot</button>
            </form>
          </div>
        </div>
      </div>

      <h3 className="mt-5">Current Reservation Status</h3>
      <div className="row g-3">
        {slots.map((slot) => (
          <div className="col-md-3" key={slot._id}>
            <SlotBadge slot={slot} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default OwnerDashboard;
