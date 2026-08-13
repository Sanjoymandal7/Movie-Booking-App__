import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import Swal from "sweetalert2";

const Payment = () => {

    const navigate = useNavigate();

    const { orderItem } = useSelector(
        (state) => state.order
    );

    const [loading, setLoading] = useState(false);

    const id = localStorage.getItem("userId");


    /* ==========================================
       SAFETY CHECK
    ========================================== */

    if (!orderItem || orderItem.length === 0) {

        return (

            <div className="payment-empty">

                <h2>No booking found</h2>

                <p>
                    Please select a movie and seats first.
                </p>

                <button
                    onClick={() => navigate("/")}
                >
                    BACK TO MOVIES
                </button>

            </div>

        );

    }


    const movie = orderItem[0][0];

    const selectedSeats =
        orderItem[0].seat || [];

    const ticketAmount =
        Number(orderItem[0].total) || 0;


    /* ==========================================
       CHARGES
    ========================================== */

    const bookingCharge = 160;

    const grandTotal =
        ticketAmount + bookingCharge;


    /* ==========================================
       NAVIGATE HOME
    ========================================== */

    const navigateTO = () => {

        navigate("/");

        window.location.reload();

    };


    /* ==========================================
       CREATE ORDER
    ========================================== */

    const handleOrder = async () => {

        if (loading) return;

        try {

            setLoading(true);

            const { data } = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/v1/order/create-order`,
    data ,


                {

                    name: movie.name,

                    seat: JSON.stringify(
                        selectedSeats
                    ),

                    total: ticketAmount,

                    img: movie.image,

                    user: id

                }

            );


            if (data?.success) {

                await Swal.fire({

                    title:
                        "Booking Confirmed!",

                    text:
                        `${selectedSeats.length} seat${
                            selectedSeats.length > 1
                                ? "s"
                                : ""
                        } successfully booked.`,

                    icon:
                        "success",

                    confirmButtonText:
                        "Done",

                    background:
                        "#141419",

                    color:
                        "#ffffff",

                    confirmButtonColor:
                        "#e9ad2f"

                });


                navigateTO();

            }

        } catch (error) {

            console.log(error);


            Swal.fire({

                title:
                    "Booking Failed",

                text:
                    "Something went wrong. Please try again.",

                icon:
                    "error",

                background:
                    "#141419",

                color:
                    "#ffffff",

                confirmButtonColor:
                    "#e9ad2f"

            });


        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="dino-payment-page">


            {/* =====================================
                PAGE HEADER
            ====================================== */}

            <div className="payment-page-heading">

                <span className="payment-small-title">

                    DINO MOVIES

                </span>


                <h1>
                    Booking Summary
                </h1>


                <p>
                    Review your booking before confirmation
                </p>

            </div>



            {/* =====================================
                CHECKOUT CARD
            ====================================== */}

            <div className="dino-checkout-card">


                {/* =================================
                    MOVIE POSTER
                ================================== */}

                <div className="checkout-poster-section">


                    <img

                        src={movie.image}

                        alt={movie.name}

                        className="checkout-movie-poster"

                    />


                    <div className="poster-overlay">

                    </div>


                </div>



                {/* =================================
                    BOOKING INFORMATION
                ================================== */}

                <div className="checkout-information">


                    {/* MOVIE */}

                    <div className="checkout-movie-header">


                        <span className="checkout-label">

                            YOUR MOVIE

                        </span>


                        <h2>

                            {movie.name}

                        </h2>


                        {movie.starring && (

                            <p>

                                {movie.starring}

                            </p>

                        )}


                    </div>



                    <div className="checkout-divider">

                    </div>



                    {/* =================================
                        SELECTED SEATS
                    ================================== */}

                    <div className="checkout-row">


                        <div>

                            <span className="checkout-label">

                                SELECTED SEATS

                            </span>


                            <div className="checkout-seat-list">


                                {selectedSeats.map(
                                    (seat) => (

                                        <span
                                            key={seat}
                                            className="checkout-seat"
                                        >

                                            {seat}

                                        </span>

                                    )
                                )}


                            </div>

                        </div>


                        <div className="checkout-ticket-count">

                            <span className="checkout-label">

                                TICKETS

                            </span>

                            <strong>

                                {
                                    selectedSeats.length
                                }

                            </strong>

                        </div>


                    </div>



                    <div className="checkout-divider">

                    </div>



                    {/* =================================
                        PRICE BREAKDOWN
                    ================================== */}

                    <div className="price-breakdown">


                        <div className="price-row">

                            <span>
                                Ticket Amount
                            </span>

                            <strong>
                                ₹{ticketAmount}
                            </strong>

                        </div>


                        <div className="price-row">

                            <span>
                                Booking Charge
                            </span>

                            <strong>
                                ₹{bookingCharge}
                            </strong>

                        </div>


                    </div>



                    <div className="checkout-divider">

                    </div>



                    {/* =================================
                        TOTAL
                    ================================== */}

                    <div className="checkout-total">


                        <div>

                            <span>
                                TOTAL PAYABLE
                            </span>

                            <small>
                                Inclusive of booking charges
                            </small>

                        </div>


                        <strong>

                            ₹{grandTotal}

                        </strong>


                    </div>



                    {/* =================================
                        CONFIRM BUTTON
                    ================================== */}

                    <button

                        className="confirm-booking-button"

                        onClick={handleOrder}

                        disabled={loading}

                    >

                        {loading
                            ? "CONFIRMING..."
                            : `CONFIRM BOOKING • ₹${grandTotal}`
                        }

                    </button>



                    <div className="secure-booking-text">

                        <span>
                            ✓
                        </span>

                        Secure booking with DINO MOVIES

                    </div>


                </div>


            </div>


        </div>

    );

};


export default Payment;