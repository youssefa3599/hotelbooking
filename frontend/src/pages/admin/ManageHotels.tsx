// src/pages/admin/ManageHotels.tsx

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import "./ManageHotels.css"; // ✅ Import CSS

interface Hotel {
  _id: string;
  name: string;
  location: string;
  rooms: any[];
  mainImage: string; // ✅ Include mainImage
}

export default function ManageHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    async function fetchHotels() {
      try {
        const res = await api.get("/hotels");
        setHotels(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch hotels:", err);
      }
    }
    fetchHotels();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;

    try {
      await api.delete(`/hotels/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setHotels((prev) => prev.filter((hotel) => hotel._id !== id));
      console.log("🗑️ Hotel deleted:", id);
    } catch (err) {
      console.error("❌ Failed to delete hotel:", err);
    }
  };

  if (user?.role !== "admin") {
    return <p className="text-center text-red-500">🚫 Unauthorized</p>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">🏨 Manage Hotels</h2>
      <Link to="/admin/create-hotel" className="text-blue-600 underline mb-4 block">
        + Create New Hotel
      </Link>
      <div className="hotel-list">
        {hotels.map((hotel) => (
          <div key={hotel._id} className="hotel-card">
            <img src={hotel.mainImage} alt={hotel.name} className="hotel-image" />
            <div className="hotel-info">
              <h3 className="hotel-name">{hotel.name}</h3>
              <p className="hotel-location">{hotel.location}</p>
              <p>🛏️ {hotel.rooms.length} room types</p>
              <div className="button-group">
                <button
                  onClick={() => navigate(`/admin/edit-hotel/${hotel._id}`)}
                  className="edit-btn"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(hotel._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
