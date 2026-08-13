import { useState } from "react";
import { seatData } from "../Seat";
import { Container, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { add } from "../redux/orderSlice";

const sections = [
  { name: "SILVER", price: 150, rows: ["A", "B", "C"] },
  { name: "PREMIUM", price: 200, rows: ["D", "E"] },
  { name: "RECLINER", price: 300, rows: ["F", "G"] },
];

const getSeats = (row) =>
  Array.from({ length: 20 }, (_, index) => row[`seat${index + 1}`]);

const getSeatPrice = (seat) => {
  const row = seatData.find((item) => getSeats(item).includes(seat));
  return row ? Number(row.price) : 0;
};

const BookTicket = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bookItem } = useSelector((state) => state.book);

  const isLogin =
    useSelector((state) => state.auth?.isLogin) ||
    Boolean(localStorage.getItem("userId"));

  const [checkedList, setCheckedList] = useState([]);
  const movie = bookItem?.[0];

  const total = checkedList.reduce(
    (sum, seat) => sum + getSeatPrice(seat),
    0
  );

  const handleSelect = (seat) => {
    setCheckedList((current) =>
      current.includes(seat)
        ? current.filter((item) => item !== seat)
        : [...current, seat]
    );
  };

  const confirmBooking = () => {
    if (!movie) {
      navigate("/");
      return;
    }

    if (checkedList.length === 0) {
      alert("Please select at least one seat.");
      return;
    }

    const booking = {
      ...movie,
      seat: checkedList,
      total: Number(total),
    };

    dispatch(add(booking));
    navigate(isLogin ? "/payment" : "/login");
  };

  return (
    <div className="dino-booking-page">
      <Container maxWidth="lg">
        <div className="booking-movie-header">
          <Typography variant="h4" className="booking-movie-title">
            {movie?.name || "DINO MOVIES"}
          </Typography>
          {movie?.starring && (
            <Typography className="booking-movie-starring">
              Starring: {movie.starring}
            </Typography>
          )}
        </div>

        <div className="dino-screen-container">
          <div className="dino-screen-title">SCREEN</div>
          <div className="dino-screen">
            <div className="screen-inner-glow" />
          </div>
          <div className="dino-screen-light" />
          <div className="dino-screen-direction">ALL EYES THIS WAY</div>
        </div>

        <div className="dino-seat-scroll">
          <div className="dino-theatre-seating">
            {sections.map((section) => {
              const sectionRows = seatData.filter((row) =>
                section.rows.includes(row.section)
              );

              return (
                <div
                  className={`dino-ticket-section ${section.name.toLowerCase()}`}
                  key={section.name}
                >
                  <div className="dino-section-header">
                    <div className="dino-section-line" />
                    <div className="dino-section-information">
                      <span className="dino-section-name">{section.name}</span>
                      <span className="dino-section-price">₹{section.price}</span>
                    </div>
                    <div className="dino-section-line" />
                  </div>

                  <div className="dino-section-rows">
                    {sectionRows.map((row) => (
                      <div className="dino-seat-row" key={row.id}>
                        <div className="dino-row-letter">{row.section}</div>
                        <div className="dino-seat-group">
                          {getSeats(row).map((seat, index) => {
                            const selected = checkedList.includes(seat);
                            return (
                              <button
                                key={seat}
                                type="button"
                                title={`${seat} • ₹${Number(row.price)}`}
                                onClick={() => handleSelect(seat)}
                                className={
                                  selected
                                    ? "dino-seat dino-seat-selected"
                                    : "dino-seat"
                                }
                              >
                                {index + 1}
                              </button>
                            );
                          })}
                        </div>
                        <div className="dino-row-letter">{row.section}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dino-seat-legend">
          <div className="legend-item">
            <span className="dino-legend-seat legend-available" />
            <span>Available</span>
          </div>
          <div className="legend-item">
            <span className="dino-legend-seat legend-selected" />
            <span>Selected</span>
          </div>
          <div className="legend-item">
            <span className="dino-legend-seat legend-booked" />
            <span>Booked</span>
          </div>
        </div>

        <div className="dino-booking-summary">
          <div className="dino-selected-information">
            <span className="selected-label">SELECTED SEATS</span>
            <div className="selected-seat-names">
              {checkedList.length > 0
                ? checkedList.join(", ")
                : "No seats selected"}
            </div>
          </div>
          <div className="dino-ticket-count">
            <small>TICKETS</small>
            <strong>{checkedList.length}</strong>
          </div>
          <div className="dino-total-price">
            <small>TOTAL</small>
            <strong>₹{total}</strong>
          </div>
          <button className="dino-continue-button" onClick={confirmBooking}>
            CONTINUE
          </button>
        </div>
      </Container>
    </div>
  );
};

export default BookTicket;
