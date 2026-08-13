import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";

const API_URL = (
  process.env.REACT_APP_API_URL || "http://localhost:8027"
).replace(/\/$/, "");

const parseSeats = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch {
    return String(value)
      .replaceAll("[", "")
      .replaceAll("]", "")
      .replaceAll('"', "")
      .split(",")
      .map((seat) => seat.trim())
      .filter(Boolean);
  }
};

const Payment = () => {
  const navigate = useNavigate();
  const { orderItem } = useSelector((state) => state.order);
  const [loading, setLoading] = useState(false);
  const booking = orderItem?.[0];

  if (!booking) {
    return (
      <div className="payment-empty">
        <h2>No booking found</h2>
        <p>Please select a movie and seats first.</p>
        <button onClick={() => navigate("/")}>BACK TO MOVIES</button>
      </div>
    );
  }

  const movie = booking;
  const selectedSeats = parseSeats(booking.seat);
  const ticketAmount = Number(booking.total) || 0;
  const bookingCharge = 160;
  const grandTotal = ticketAmount + bookingCharge;
  const userId = localStorage.getItem("userId");

  const handleOrder = async () => {
    if (loading) return;

    if (!userId) {
      await Swal.fire({
        title: "Login Required",
        text: "Please login before confirming your booking.",
        icon: "warning",
        background: "#141419",
        color: "#ffffff",
        confirmButtonColor: "#e9ad2f",
      });
      navigate("/login");
      return;
    }

    if (!movie?.name || !movie?.image || selectedSeats.length === 0) {
      await Swal.fire({
        title: "Incomplete Booking",
        text: "Movie, poster, or seat information is missing.",
        icon: "warning",
        background: "#141419",
        color: "#ffffff",
        confirmButtonColor: "#e9ad2f",
      });
      return;
    }

    const payload = {
      name: movie.name,
      seat: JSON.stringify(selectedSeats),
      total: Number(grandTotal),
      img: movie.image,
      user: userId,
    };

    try {
      setLoading(true);

      const { data } = await axios.post(
        `${API_URL}/api/v1/order/create-order`,
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      if (!data?.success) {
        throw new Error(data?.message || "Booking could not be created.");
      }

      await Swal.fire({
        title: "Booking Confirmed!",
        text: `${selectedSeats.length} seat${selectedSeats.length > 1 ? "s" : ""} successfully booked.`,
        icon: "success",
        confirmButtonText: "Done",
        background: "#141419",
        color: "#ffffff",
        confirmButtonColor: "#e9ad2f",
      });

      navigate("/orders");
    } catch (error) {
      console.error("Booking request failed:", error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error?.message ||
        error?.message ||
        "Unable to create your booking.";

      await Swal.fire({
        title: "Booking Failed",
        text: message,
        icon: "error",
        background: "#141419",
        color: "#ffffff",
        confirmButtonColor: "#e9ad2f",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dino-payment-page">
      <div className="payment-page-heading">
        <span className="payment-small-title">DINO MOVIES</span>
        <h1>Booking Summary</h1>
        <p>Review your booking before confirmation</p>
      </div>

      <div className="dino-checkout-card">
        <div className="checkout-poster-section">
          <img src={movie.image} alt={movie.name} className="checkout-movie-poster" />
          <div className="poster-overlay" />
        </div>

        <div className="checkout-information">
          <div className="checkout-movie-header">
            <span className="checkout-label">YOUR MOVIE</span>
            <h2>{movie.name}</h2>
            {movie.starring && <p>{movie.starring}</p>}
          </div>

          <div className="checkout-divider" />

          <div className="checkout-row">
            <div>
              <span className="checkout-label">SELECTED SEATS</span>
              <div className="checkout-seat-list">
                {selectedSeats.map((seat) => (
                  <span key={seat} className="checkout-seat">{seat}</span>
                ))}
              </div>
            </div>
            <div className="checkout-ticket-count">
              <span className="checkout-label">TICKETS</span>
              <strong>{selectedSeats.length}</strong>
            </div>
          </div>

          <div className="checkout-divider" />

          <div className="price-breakdown">
            <div className="price-row"><span>Ticket Amount</span><strong>₹{ticketAmount}</strong></div>
            <div className="price-row"><span>Booking Charge</span><strong>₹{bookingCharge}</strong></div>
          </div>

          <div className="checkout-divider" />

          <div className="checkout-total">
            <div>
              <span>TOTAL PAYABLE</span>
              <small>Inclusive of booking charges</small>
            </div>
            <strong>₹{grandTotal}</strong>
          </div>

          <button className="confirm-booking-button" onClick={handleOrder} disabled={loading}>
            {loading ? "CONFIRMING..." : `CONFIRM BOOKING • ₹${grandTotal}`}
          </button>

          <div className="secure-booking-text"><span>✓</span>Secure booking with DINO MOVIES</div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
