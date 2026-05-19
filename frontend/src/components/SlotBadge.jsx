import React from 'react';
function SlotBadge({ slot, onReserve }) {
  return (
    <div className={`slot-box ${slot.isReserved ? 'slot-reserved' : 'slot-available'}`}>
      <strong>{slot.date}</strong>
      <div>{slot.startTime} - {slot.endTime}</div>
      <span className="badge bg-light text-dark mb-2">{slot.isReserved ? 'Reserved' : 'Available'}</span>
      {!slot.isReserved && onReserve && (
        <button className="btn btn-sm btn-light" onClick={() => onReserve(slot._id)}>Reserve</button>
      )}
    </div>
  );
}

export default SlotBadge;
