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
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState('');

  const loadOwnerData = async () => {
    setLoading(true);
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
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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

  const handleDeleteStadium = async (stadiumId, stadiumName) => {
    const confirmed = window.confirm(`Delete stadium "${stadiumName}"? This will also delete related slots and reservations.`);
    if (!confirmed) return;

    setDeletingId(stadiumId);
    try {
      await authFetch(`/stadiums/${stadiumId}`, { method: 'DELETE' });
      setMessage('Stadium deleted successfully.');
      loadOwnerData();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId('');
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
      {loading && <div className="alert alert-light border">Loading dashboard data...</div>}

      {stats && (
        <>
          <div className="row g-3 mb-4">
            <div className="col-md-3"><div className="stat-card">🏟️ Stadiums <strong>{stats.totalStadiums}</strong></div></div>
            <div className="col-md-3"><div className="stat-card">🕒 Total Slots <strong>{stats.totalSlots}</strong></div></div>
            <div className="col-md-3"><div className="stat-card">🔴 Reserved <strong>{stats.reservedSlots}</strong></div></div>
            <div className="col-md-3"><div className="stat-card">🟢 Available <strong>{stats.availableSlots}</strong></div></div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-md-3"><div className="stat-card">📈 Reserved % <strong>{stats.reservedPercentage}%</strong></div></div>
            <div className="col-md-3"><div className="stat-card">📉 Available % <strong>{stats.availablePercentage}%</strong></div></div>
            <div className="col-md-3"><div className="stat-card">🥇 Most Free <strong>{stats.stadiumWithMostAvailableSlots ? stats.stadiumWithMostAvailableSlots.name : 'N/A'}</strong></div></div>
            <div className="col-md-3"><div className="stat-card">🔥 Most Reserved <strong>{stats.stadiumWithMostReservations ? stats.stadiumWithMostReservations.name : 'N/A'}</strong></div></div>
          </div>

          <div className="row g-3 mb-4">
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="text-success">Recent Stadiums</h5>
                  {stats.recentStadiums && stats.recentStadiums.length > 0 ? (
                    <ul className="mb-0">
                      {stats.recentStadiums.map((recent) => (
                        <li key={recent._id}>{recent.name}</li>
                      ))}
                    </ul>
                  ) : <p className="text-muted mb-0">No recent stadiums.</p>}
                </div>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <h5 className="text-success">Recent Slots</h5>
                  {stats.recentSlots && stats.recentSlots.length > 0 ? (
                    <ul className="mb-0">
                      {stats.recentSlots.map((recentSlot) => (
                        <li key={recentSlot._id}>{recentSlot.date} ({recentSlot.startTime} - {recentSlot.endTime})</li>
                      ))}
                    </ul>
                  ) : <p className="text-muted mb-0">No recent slots.</p>}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <h4 className="mb-3">Your Stadiums</h4>
      <div className="row g-3">
        {stadiums.map((stadium) => (
          <div className="col-md-6 col-lg-4" key={stadium._id}>
            <div className="card h-100 shadow-sm owner-stadium-card">
              <Link to={`/owner/stadiums/${stadium._id}`} className="text-decoration-none">
                <div className="card-body">
                  <h5 className="card-title text-success">{stadium.name}</h5>
                  <p className="card-text mb-1"><strong>Location:</strong> {stadium.location}</p>
                  <p className="card-text text-muted stadium-preview">{stadium.description}</p>
                  <div className="small">
                    <span className="badge bg-success me-2">Slots: {slotCounts[stadium._id]?.total ?? 0}</span>
                    <span className="badge bg-light text-success border">Available: {slotCounts[stadium._id]?.available ?? 0}</span>
                  </div>
                </div>
              </Link>
              <div className="card-footer bg-transparent border-0 pt-0 pb-3 px-3">
                <button
                  className="btn btn-outline-danger btn-sm rounded-pill"
                  disabled={deletingId === stadium._id}
                  onClick={() => handleDeleteStadium(stadium._id, stadium.name)}
                >
                  {deletingId === stadium._id ? 'Deleting...' : '🗑 Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {stadiums.length === 0 && !loading && <p className="text-muted">No stadiums yet. Click “Add Stadium” to create your first one.</p>}

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
