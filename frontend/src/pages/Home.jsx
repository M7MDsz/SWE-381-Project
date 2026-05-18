import { useEffect, useState } from 'react';
import StadiumCard from '../components/StadiumCard';

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
    <div>
      <section className="hero p-4 p-md-5 rounded mb-4 text-white">
        <h1>Organize Soccer Matches Easily</h1>
        <p className="lead mb-0">Search stadiums, check schedules, and reserve available time slots.</p>
      </section>

      <form className="card card-body mb-4" onSubmit={handleSearch}>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Location</label>
            <input className="form-control" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Riyadh" />
          </div>
          <div className="col-md-3">
            <label className="form-label">Date</label>
            <input type="date" className="form-control" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="col-md-3">
            <label className="form-label">Start Time</label>
            <input type="time" className="form-control" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-success w-100" type="submit">Search</button>
          </div>
        </div>
      </form>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4">
        {stadiums.map((stadium) => (
          <div className="col-md-4" key={stadium._id}>
            <StadiumCard stadium={stadium} />
          </div>
        ))}
      </div>
      {stadiums.length === 0 && <p className="text-muted">No stadiums found.</p>}
    </div>
  );
}

export default Home;
