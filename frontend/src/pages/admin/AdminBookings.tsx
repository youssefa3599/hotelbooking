import { useEffect, useState } from "react";
import axios from "axios";
import "./AdminBookings.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

type BookingType = {
  _id: string;
  hotel: { name: string };
  user: { email: string };
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  stripeSessionId: string;
};

const AdminBookings = () => {
  const [bookings, setBookings] = useState<BookingType[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API_BASE_URL}/bookings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setBookings(res.data);
        console.log("✅ Admin bookings fetched:", res.data);
      } catch (err) {
        console.error("❌ Failed to fetch bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="admin-bookings-container">
      <h2 className="admin-bookings-title">All Bookings</h2>
      <div>
        {bookings.map((booking) => (
          <div key={booking._id} className="booking-card">
            <p><strong>User:</strong> {booking.user?.email}</p>
            <p><strong>Hotel:</strong> {booking.hotel?.name}</p>
            <p><strong>Room:</strong> {booking.roomType}</p>
            <p><strong>Dates:</strong> {booking.checkInDate} to {booking.checkOutDate}</p>
            <p className="status-paid">Paid via Stripe</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBookings;
