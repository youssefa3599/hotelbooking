// src/pages/BookingPage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function BookingPage() {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState<any>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/hotels/${hotelId}`);
        setHotel(response.data);
      } catch (err) {
        console.error("Error fetching hotel:", err);
      }
    };
    fetchHotel();
  }, [hotelId]);

  const handleBooking = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/bookings`, {
        hotelId,
        checkIn,
        checkOut,
      });
      alert("Booking successful!");
    } catch (err) {
      console.error("Booking failed:", err);
      alert("Booking failed!");
    }
  };

  if (!hotel) return <p>Loading...</p>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <img src={hotel.image} alt={hotel.name} className="w-full h-64 object-cover rounded-xl mb-4" />
      <h1 className="text-2xl font-bold">{hotel.name}</h1>
      <p className="text-gray-600 mb-2">{hotel.location}</p>
      <p className="text-blue-600 font-semibold mb-4">${hotel.pricePerNight} / night</p>

      <div className="space-y-4">
        <label className="block">
          Check-in:
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </label>
        <label className="block">
          Check-out:
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="w-full border p-2 rounded mt-1"
          />
        </label>
        <button
          onClick={handleBooking}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}
