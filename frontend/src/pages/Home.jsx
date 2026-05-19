import React from 'react';
import { useEffect, useState } from 'react';
import StadiumCard from '../components/StadiumCard';
import heroStadium from '../assets/hero-stadium.svg';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function Home() {
  const [stadiums, setStadiums] = useState([]);
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [error, setError] = useState('');

  const loadStadiums = async () => {
    try {
      const params = new URLSearchParams();
      if (location) params.append('location', location);
      if (date) params.append('date', date);
      if (startTime) params.append('startTime', startTime);

      const response = await fetch(`${API_URL}/stadiums?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || 'Could not load stadiums');

      setStadiums(data);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadStadiums();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadStadiums();
  };

  return (
    <div className="home-page">
      <section className="hero hero-modern overflow-hidden mb-5 text-white">
        <div className="row align-items-center g-4">
          <div className="col-lg-6">
            <span className="hero-kicker">Find your next pitch</span>
            <h1 className="display-5 fw-bold mt-3 mb-3">Book soccer stadiums with Soccer Player</h1>
            <p className="lead mb-4">Search by location and time, compare stadiums, and reserve the best available slot in a few clicks.</p>
            <div className="d-flex flex-wrap gap-3 hero-metrics">
              <div><strong>{stadiums.length}</strong><span>stadiums listed</span></div>
              <div><strong>7</strong><span>days of slots</span></div>
              <div><strong>24/7</strong><span>easy booking</span></div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="hero-image-card">
              <img src={heroStadium} alt="Soccer stadium" className="img-fluid" />
            </div>
          </div>
        </div>
      </section>

      <section className="search-panel card border-0 shadow-lg mb-5">
        <div className="card-body p-4 p-lg-5">
          <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-4">
            <div>
              <span className="section-label">Search</span>
              <h2 className="h3 fw-bold mb-1">Find an available stadium</h2>
              <p className="text-muted mb-0">Filter by location, date, and preferred start time.</p>
            </div>
          </div>

          <form onSubmit={handleSearch}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label fw-semibold">Location</label>
                <div className="input-group input-group-modern">
                  <span className="input-group-text">📍</span>
                  <input className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Riyadh" />
                </div>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Date</label>
                <div className="input-group input-group-modern">
                  <span className="input-group-text">📅</span>
                  <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
              </div>
              <div className="col-md-3">
                <label className="form-label fw-semibold">Start Time</label>
                <div className="input-group input-group-modern">
                  <span className="input-group-text">⏰</span>
                  <input type="time" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                </div>
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button className="btn btn-success btn-lg w-100 rounded-pill" type="submit">Search</button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {error && <div className="alert alert-danger">{error}</div>}

      <section className="mb-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-2 mb-4">
          <div>
            <span className="section-label">Featured stadiums</span>
            <h2 className="fw-bold mb-1">Explore available places to play</h2>
            <p className="text-muted mb-0">Choose a stadium, view the schedule, and reserve an open slot.</p>
          </div>
        </div>

        <div className="row g-4">
          {stadiums.slice(0, 6).map((stadium) => (
            <div className="col-md-6 col-lg-4" key={stadium._id}>
              <StadiumCard stadium={stadium} />
            </div>
          ))}
        </div>

        {stadiums.length === 0 && !error && (
          <div className="empty-state card border-0 shadow-sm text-center p-5 mt-3">
            <div className="empty-icon">🏟️</div>
            <h4 className="fw-bold">No stadiums found</h4>
            <p className="text-muted mb-0">Try another location, date, or time. New stadiums may be added soon.</p>
          </div>
        )}
      </section>

      <section className="row g-4 mb-5">
        <div className="col-lg-6">
          <div className="info-card h-100">
            <span className="section-label">How it works</span>
            <h3 className="fw-bold mb-4">Reserve in three simple steps</h3>
            <div className="step-item"><span>1</span><div><strong>Search</strong><p>Find stadiums by location and available time.</p></div></div>
            <div className="step-item"><span>2</span><div><strong>Check schedule</strong><p>Review green available slots and red reserved slots.</p></div></div>
            <div className="step-item"><span>3</span><div><strong>Book</strong><p>Sign in, reserve your slot, and get ready to play.</p></div></div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="info-card h-100 why-card">
            <span className="section-label">Why choose us</span>
            <h3 className="fw-bold mb-4">Built for players and stadium owners</h3>
            <div className="row g-3">
              <div className="col-sm-6"><div className="mini-feature">✅ Live availability</div></div>
              <div className="col-sm-6"><div className="mini-feature">🔒 Secure login</div></div>
              <div className="col-sm-6"><div className="mini-feature">⚽ Player friendly</div></div>
              <div className="col-sm-6"><div className="mini-feature">📊 Owner statistics</div></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
