import React from "react";

const parseSeats = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch {
    return String(value).replaceAll("[", "").replaceAll("]", "").replaceAll('"', "").split(",").map((s) => s.trim()).filter(Boolean);
  }
};

const formatDate = (value) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};

const formatTime = (value) => {
  const date = new Date(value);
  if (!value || Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
};

export default function OrderCard({ name, seat, username, img, total, time, id }) {
  const seats = parseSeats(seat);
  const bookingId = id ? String(id).slice(-8).toUpperCase() : "DINOMOVIE";

  return (
    <article className="dino-order-ticket">
      <div className="ticket-poster-wrapper">
        <img src={img} alt={name} className="ticket-movie-poster" />
        <div className="ticket-status-badge">CONFIRMED</div>
      </div>
      <div className="ticket-main-content">
        <div className="ticket-brand-row">
          <div><span className="ticket-brand">DINO MOVIES</span><span className="ticket-type">DIGITAL TICKET</span></div>
          <div className="ticket-booking-number"><small>BOOKING ID</small><strong>#{bookingId}</strong></div>
        </div>
        <div className="ticket-movie-info">
          <span className="ticket-small-label">MOVIE</span>
          <h2>{name}</h2>
          <p>Booked by {username || "User"}</p>
        </div>
        <div className="ticket-divider" />
        <div className="ticket-details-grid">
          <div className="ticket-detail"><span className="ticket-small-label">BOOKED ON</span><strong>{formatDate(time)}</strong><small>{formatTime(time)}</small></div>
          <div className="ticket-detail"><span className="ticket-small-label">TICKETS</span><strong>{seats.length}</strong><small>{seats.length === 1 ? "1 Seat" : `${seats.length} Seats`}</small></div>
          <div className="ticket-detail"><span className="ticket-small-label">TOTAL</span><strong className="ticket-amount">₹{Number(total) || 0}</strong><small>Confirmed</small></div>
        </div>
        <div className="ticket-seat-section">
          <span className="ticket-small-label">YOUR SEATS</span>
          <div className="ticket-seat-list">
            {seats.map((seatNumber) => <span className="ticket-seat-number" key={seatNumber}>{seatNumber}</span>)}
          </div>
        </div>
      </div>
    </article>
  );
}
