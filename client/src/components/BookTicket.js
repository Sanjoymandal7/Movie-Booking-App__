import { useEffect, useState } from "react";
import { seatData } from "../Seat";

import {
    Container,
    Typography
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { add } from "../redux/orderSlice";


const BookTicket = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Current movie
    const { bookItem } = useSelector((state) => state.book);

    // Login status
    let isLogin = useSelector((state) => state.isLogin);

    isLogin =
        isLogin ||
        localStorage.getItem("userId");


    // Selected seats
    const [checkedList, setCheckedList] = useState([]);

    // Total amount
    const [total, setTotal] = useState(0);


    /* ============================================
       CINEMA SECTIONS
    ============================================ */

    const sections = [

        {
            name: "SILVER",
            price: 150,
            rows: ["A", "B", "C"]
        },

        {
            name: "PREMIUM",
            price: 200,
            rows: ["D", "E"]
        },

        {
            name: "RECLINER",
            price: 300,
            rows: ["F", "G"]
        }

    ];


    /* ============================================
       GET 20 SEATS FROM EACH ROW
    ============================================ */

    const getSeats = (row) => {

        return Array.from(
            { length: 20 },
            (_, index) =>
                row[`seat${index + 1}`]
        );

    };


    /* ============================================
       SELECT / UNSELECT SEAT
    ============================================ */

    const handleSelect = (seat) => {

        if (checkedList.includes(seat)) {

            // Remove seat

            setCheckedList(
                checkedList.filter(
                    (item) => item !== seat
                )
            );

        } else {

            // Add seat

            setCheckedList([
                ...checkedList,
                seat
            ]);

        }

    };


    /* ============================================
       CALCULATE TOTAL
    ============================================ */

    const totalAmount = () => {

        let amount = 0;

        for (let selectedSeat of checkedList) {

            for (let row of seatData) {

                if (
                    Object.values(row).includes(
                        selectedSeat
                    )
                ) {

                    amount += Number(row.price);

                }

            }

        }

        return amount;

    };


    useEffect(() => {

        setTotal(totalAmount());

    }, [checkedList]);


    /* ============================================
       CONFIRM BOOKING
    ============================================ */

    const confirmBooking = () => {

        // Don't continue without seat

        if (checkedList.length === 0) {

            alert(
                "Please select at least one seat."
            );

            return;

        }


        const bookingDetails = {

            seat: checkedList,

            total: total

        };


        const final = {

            ...bookItem,

            ...bookingDetails

        };


        console.log(final);


        // Save booking in Redux
        dispatch(add(final));


        // Navigate

        if (isLogin) {

            navigate("/payment");

        } else {

            navigate("/login");

        }

    };


    /* ============================================
       UI
    ============================================ */

    return (

        <div className="dino-booking-page">

            <Container maxWidth="lg">


                {/* =================================
                    MOVIE INFORMATION
                ================================= */}

                <div className="booking-movie-header">

                    <Typography
                        variant="h4"
                        className="booking-movie-title"
                    >

                        {bookItem?.[0]?.name ||
                            "DINO MOVIES"}

                    </Typography>


                    {bookItem?.[0]?.starring && (

                        <Typography
                            className="booking-movie-starring"
                        >

                            Starring:{" "}

                            {bookItem[0].starring}

                        </Typography>

                    )}

                </div>



                {/* =================================
                    CINEMA SCREEN
                ================================= */}

                <div className="dino-screen-container">


                    <div className="dino-screen-title">

                        SCREEN

                    </div>


                    <div className="dino-screen">

                        <div className="screen-inner-glow">

                        </div>

                    </div>


                    <div className="dino-screen-light">

                    </div>


                    <div className="dino-screen-direction">

                        ALL EYES THIS WAY

                    </div>


                </div>



                {/* =================================
                    CINEMA SEATING
                ================================= */}

                <div className="dino-seat-scroll">

                    <div className="dino-theatre-seating">


                        {sections.map((section) => {


                            const sectionRows =
                                seatData.filter(
                                    (row) =>
                                        section.rows.includes(
                                            row.section
                                        )
                                );


                            return (

                                <div

                                    className={
                                        `dino-ticket-section ${section.name.toLowerCase()}`
                                    }

                                    key={
                                        section.name
                                    }

                                >


                                    {/* =========================
                                        SECTION TITLE + PRICE
                                    ========================= */}

                                    <div className="dino-section-header">


                                        <div className="dino-section-line">

                                        </div>


                                        <div className="dino-section-information">


                                            <span className="dino-section-name">

                                                {section.name}

                                            </span>


                                            <span className="dino-section-price">

                                                ₹{section.price}

                                            </span>


                                        </div>


                                        <div className="dino-section-line">

                                        </div>


                                    </div>



                                    {/* =========================
                                        SECTION ROWS
                                    ========================= */}

                                    <div className="dino-section-rows">


                                        {sectionRows.map(
                                            (row) => {


                                                const seats =
                                                    getSeats(
                                                        row
                                                    );


                                                return (

                                                    <div

                                                        className="dino-seat-row"

                                                        key={
                                                            row.id
                                                        }

                                                    >


                                                        {/* LEFT ROW LETTER */}

                                                        <div className="dino-row-letter">

                                                            {
                                                                row.section
                                                            }

                                                        </div>



                                                        {/* SEATS */}

                                                        <div className="dino-seat-group">


                                                            {seats.map(
                                                                (
                                                                    seat,
                                                                    index
                                                                ) => {


                                                                    const selected =
                                                                        checkedList.includes(
                                                                            seat
                                                                        );


                                                                    return (

                                                                        <button

                                                                            key={
                                                                                seat
                                                                            }

                                                                            type="button"

                                                                            title={
                                                                                `${seat} • ₹${row.price}`
                                                                            }

                                                                            onClick={
                                                                                () =>
                                                                                    handleSelect(
                                                                                        seat
                                                                                    )
                                                                            }

                                                                            className={
                                                                                selected
                                                                                    ? "dino-seat dino-seat-selected"
                                                                                    : "dino-seat"
                                                                            }

                                                                        >


                                                                            {
                                                                                index +
                                                                                1
                                                                            }


                                                                        </button>

                                                                    );

                                                                }
                                                            )}


                                                        </div>



                                                        {/* RIGHT ROW LETTER */}

                                                        <div className="dino-row-letter">

                                                            {
                                                                row.section
                                                            }

                                                        </div>


                                                    </div>

                                                );

                                            }
                                        )}


                                    </div>


                                </div>

                            );

                        })}


                    </div>

                </div>



                {/* =================================
                    LEGEND
                ================================= */}

                <div className="dino-seat-legend">


                    <div className="legend-item">

                        <span className="dino-legend-seat legend-available">

                        </span>

                        <span>
                            Available
                        </span>

                    </div>


                    <div className="legend-item">

                        <span className="dino-legend-seat legend-selected">

                        </span>

                        <span>
                            Selected
                        </span>

                    </div>


                    <div className="legend-item">

                        <span className="dino-legend-seat legend-booked">

                        </span>

                        <span>
                            Booked
                        </span>

                    </div>


                </div>



                {/* =================================
                    BOOKING SUMMARY
                ================================= */}

                <div className="dino-booking-summary">


                    {/* SELECTED SEATS */}

                    <div className="dino-selected-information">


                        <span className="selected-label">

                            SELECTED SEATS

                        </span>


                        <div className="selected-seat-names">


                            {checkedList.length > 0

                                ? checkedList.join(
                                    ", "
                                )

                                : "No seats selected"

                            }


                        </div>


                    </div>



                    {/* TICKET COUNT */}

                    <div className="dino-ticket-count">


                        <small>

                            TICKETS

                        </small>


                        <strong>

                            {
                                checkedList.length
                            }

                        </strong>


                    </div>



                    {/* TOTAL */}

                    <div className="dino-total-price">


                        <small>

                            TOTAL

                        </small>


                        <strong>

                            ₹{total}

                        </strong>


                    </div>



                    {/* CONTINUE */}

                    <button

                        className="dino-continue-button"

                        onClick={
                            confirmBooking
                        }

                    >

                        CONTINUE

                    </button>


                </div>


            </Container>

        </div>

    );

};


export default BookTicket;