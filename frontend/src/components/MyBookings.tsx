import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./MyBookings.css";

interface Hotel {
  _id: string;
  name: string;
  images: string[];
}

interface Booking {
  _id: string;
  hotelId: Hotel;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
}

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      console.log("🔄 Starting fetchBookings request...");

      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ No auth token found, redirecting to login");
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/bookings/my`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("📥 Bookings fetched successfully:", response.data);
        setBookings(response.data);
      } catch (err) {
        console.error("❌ Error fetching bookings:", err);
        setError("Failed to load bookings. Please try again.");
      } finally {
        console.log("⏳ Fetch bookings request finished");
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  if (loading)
    return (
      <div className="text-center mt-10 text-purple-600">
        ⏳ Loading your bookings...
      </div>
    );
  if (error)
    return (
      <div className="text-center mt-10 text-red-600">
        {error}
      </div>
    );

  console.log("✅ Rendering bookings list with", bookings.length, "items");

  return (
    <div className="my-bookings-container">
      <h2 className="my-bookings-title">🧾 My Bookings</h2>

      {bookings.length === 0 ? (
        <p>You haven’t made any bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((booking) => {
            console.log("🔍 Rendering booking:", booking._id);
            return (
              <li key={booking._id} className="booking-card">
                <h3 className="booking-hotel-name">{booking.hotelId?.name}</h3>
                <p className="booking-detail">
                  <strong>Room:</strong> {booking.roomType}
                </p>
                <p className="booking-detail">
                  <strong>Check-in:</strong>{" "}
                  {new Date(booking.checkInDate).toLocaleDateString()}
                </p>
                <p className="booking-detail">
                  <strong>Check-out:</strong>{" "}
                  {new Date(booking.checkOutDate).toLocaleDateString()}
                </p>
                {booking.hotelId?.images?.[0] && (
                  <img
                    src={booking.hotelId.images[0]}
                    alt={booking.hotelId.name}
                    className="booking-image"
                  />
                )}
              </li>
            );
          })}
        </ul>
      )}

      <Link to="/hotels" className="back-link">
        ← Back to Hotels
      </Link>
    </div>
  );
};

export default MyBookings;
