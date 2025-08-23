import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./HotelList.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface Hotel {
  _id: string;
  name: string;
  location: string;
  description?: string;
  mainImage: string;
}

export default function HotelList() {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/hotels`);
        console.log("✅ Fetched hotels:", res.data);
        setHotels(res.data);
      } catch (err) {
        console.error("❌ Error fetching hotels:", err);
      }
    };

    fetchHotels();
  }, []);

  return (
    <div className="hotel-list-container">
      <h1>Available Hotels</h1>
      <div className="hotel-grid">
        {hotels.map((hotel) => (
          <Link
            to={`/book/${hotel._id}`}
            key={hotel._id}
            className="hotel-card-link"
          >
            <div className="hotel-card">
              {hotel.mainImage ? (
                <img
                  src={hotel.mainImage}
                  alt={`Hotel ${hotel.name}`}
                  className="hotel-image"
                />
              ) : (
                <div className="no-image">No image available</div>
              )}

              <div className="hotel-info">
                <h2>{hotel.name}</h2>
                <p>{hotel.location}</p>
                {hotel.description && <p>{hotel.description}</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
