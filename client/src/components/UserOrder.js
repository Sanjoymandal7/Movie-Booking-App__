import { useEffect, useState } from "react";
import axios from "axios";
import OrderCard from "./OrderCard";

const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:8027").replace(/\/$/, "");

const UserOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getUserOrder = async () => {
      const id = localStorage.getItem("userId");
      if (!id) {
        setError("Please login to view your bookings.");
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(`${API_URL}/api/v1/order/user-order/${id}`);
        setOrders(data?.success ? data?.userOrder?.order || [] : []);
      } catch (error) {
        console.error("Unable to load bookings:", error);
        setError("Unable to load your bookings.");
      } finally {
        setLoading(false);
      }
    };
    getUserOrder();
  }, []);

  if (loading) return <div className="my-bookings-page">Loading your bookings...</div>;
  if (error) return <div className="my-bookings-page"><h2>{error}</h2></div>;

  return (
    <div className="my-bookings-page">
      {orders.length > 0 ? orders.map((order) => (
        <OrderCard
          key={order._id}
          id={order._id}
          name={order.name}
          img={order.img}
          seat={order.seat}
          total={order.total}
          username={order?.user?.username || "User"}
          time={order.createdAt}
        />
      )) : <h1>You Haven't Booked a Movie</h1>}
    </div>
  );
};

export default UserOrder;
