import { Link } from 'react-router-dom';
import stadiumFallback from '../assets/stadium-card.svg';

function StadiumCard({ stadium }) {
  const photo = stadium.photos && stadium.photos[0] ? stadium.photos[0] : stadiumFallback;

  return (
    <div className="card h-100 shadow-sm stadium-card-modern border-0">
      <div className="stadium-card-image-wrap">
        <img src={photo} className="card-img-top stadium-img" alt={stadium.name} />
        <span className="stadium-card-pill">Available schedules</span>
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title fw-bold">{stadium.name}</h5>
        <p className="card-text text-success fw-semibold mb-2">📍 {stadium.location}</p>
        <p className="card-text text-muted stadium-preview flex-grow-1">{stadium.description}</p>
        <Link className="btn btn-success rounded-pill mt-2" to={`/stadiums/${stadium._id}`}>View Schedule</Link>
      </div>
    </div>
  );
}

export default StadiumCard;
