import React from 'react';
import { Link } from 'react-router-dom';

function StadiumCard({ stadium }) {
  return (
    <div className="card h-100 shadow-sm">
      {stadium.photos && stadium.photos[0] && (
        <img src={stadium.photos[0]} className="card-img-top stadium-img" alt={stadium.name} />
      )}
      <div className="card-body">
        <h5 className="card-title">{stadium.name}</h5>
        <p className="card-text text-muted">{stadium.location}</p>
        <p className="card-text">{stadium.description}</p>
        <Link className="btn btn-success" to={`/stadiums/${stadium._id}`}>View Schedule</Link>
      </div>
    </div>
  );
}

export default StadiumCard;
