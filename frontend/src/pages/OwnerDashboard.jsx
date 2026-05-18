import React from 'react';
import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function OwnerDashboard() {
  const { authFetch } = useContext(AuthContext);
  const [stadiums, setStadiums] = useState([]);
  const [stats, setStats] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [stadiumForm, setStadiumForm] = useState({ name: '', description: '', location: '', facilities: '' });
  const [photoPreviews, setPhotoPreviews] = useState([]);
  const [slotCounts, setSlotCounts] = useState({});
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const loadOwnerData = async () => {
    try {
      const ownerStadiums = await authFetch('/stadiums/mine');
      const ownerStats = await authFetch('/stadiums/stats');
      setStadiums(ownerStadiums);
      setStats(ownerStats);

      const counts = {};
      for (const stadium of ownerStadiums) {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/stadiums/${stadium._id}/slots`);
        const slotData = await response.json();
        const total = Array.isArray(slotData) ? slotData.length : 0;
        const available = Array.isArray(slotData) ? slotData.filter((slot) => !slot.isReserved).length : 0;
        counts[stadium._id] = { total, available };
      }
      setSlotCounts(counts);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadOwnerData();
  }, []);

  const handleStadiumChange = (e) => {
    setStadiumForm({ ...stadiumForm, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);

    Promise.all(
      files.map((file) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
      }))
    ).then((images) => {
      setPhotoPreviews(images);
    });
  };

  const handleCreateStadium = async (e) => {
    e.preventDefault();
    try {
      await authFetch('/stadiums', {
        method: 'POST',
        body: JSON.stringify({
          ...stadiumForm,
          photos: photoPreviews,
          facilities: stadiumForm.facilities.split(',').map((item) => item.trim()).filter(Boolean)
        })
      });

      setStadiumForm({ name: '', description: '', location: '', facilities: '' });
      setPhotoPreviews([]);
      setShowModal(false);
      setMessage('Stadium added successfully.');
      loadOwnerData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Owner Dashboard</h2>
        <button className="btn btn-success" onClick={() => setShowModal(true)}>Add Stadium</button>
      </div>

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

      <h4 className="mb-3">Your Stadiums</h4>
      <div className="row g-3">
        {stadiums.map((stadium) => (
          <div className="col-md-6 col-lg-4" key={stadium._id}>
            <Link to={`/owner/stadiums/${stadium._id}`} className="text-decoration-none">
              <div className="card h-100 shadow-sm owner-stadium-card">
                <div className="card-body">
                  <h5 className="card-title text-success">{stadium.name}</h5>
                  <p className="card-text mb-1"><strong>Location:</strong> {stadium.location}</p>
                  <p className="card-text text-muted stadium-preview">{stadium.description}</p>
                  <div className="small">
                    <span className="badge bg-success me-2">Slots: {slotCounts[stadium._id]?.total ?? 0}</span>
                    <span className="badge bg-light text-success border">Available: {slotCounts[stadium._id]?.available ?? 0}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      {stadiums.length === 0 && <p className="text-muted">No stadiums yet. Click “Add Stadium” to create your first one.</p>}

      {showModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-panel card shadow-lg">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">Add New Stadium</h4>
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowModal(false)}>Close</button>
              </div>
              <form onSubmit={handleCreateStadium}>
                <input className="form-control mb-2" name="name" placeholder="Stadium name" value={stadiumForm.name} onChange={handleStadiumChange} required />
                <input className="form-control mb-2" name="location" placeholder="Location" value={stadiumForm.location} onChange={handleStadiumChange} required />
                <textarea className="form-control mb-2" name="description" placeholder="Description" value={stadiumForm.description} onChange={handleStadiumChange} required />
                <label className="form-label fw-semibold">Stadium photos</label>
                <input className="form-control mb-2" type="file" multiple accept="image/*" onChange={handlePhotoChange} />
                <small className="text-muted d-block mb-2">Selected photos are previewed here and saved to the existing photos field as browser image data.</small>
                {photoPreviews.length > 0 && (
                  <div className="photo-preview-grid mb-3">
                    {photoPreviews.map((photo) => (
                      <img src={photo} alt="Selected stadium preview" key={photo} className="photo-preview" />
                    ))}
                  </div>
                )}
                <input className="form-control mb-3" name="facilities" placeholder="Facilities separated by commas" value={stadiumForm.facilities} onChange={handleStadiumChange} />
                <button className="btn btn-success" type="submit">Save Stadium</button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerDashboard;
