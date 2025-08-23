// src/pages/BookingPage.tsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./BookingPage.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface Room {
  type: string;
  price: number;
  images: string[];
}

interface Hotel {
  _id: string;
  name: string;
  location: string;
  description: string;
  mainImage: string;
  rooms: Room[];
}

interface BookingDetail {
  quantity: number;
  checkIn: string;
  checkOut: string;
}

export default function BookingPage() {
  const { hotelId } = useParams();
  const [hotel, setHotel] = useState<Hotel | null>(null);

  const [bookingDetails, setBookingDetails] = useState<
    Record<string, BookingDetail>
  >({});

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/hotels/${hotelId}`);
        setHotel(res.data);
      } catch (err) {
        console.error("Error fetching hotel:", err);
      }
    };
    fetchHotel();
  }, [hotelId]);

  const handleRoomQuantityChange = (type: string, quantity: number) => {
    setBookingDetails((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        quantity,
      },
    }));
  };

  const handleDateChange = (
    type: string,
    field: "checkIn" | "checkOut",
    value: string
  ) => {
    setBookingDetails((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  const handleCheckboxChange = (type: string, checked: boolean) => {
    setBookingDetails((prev) => {
      if (checked) {
        return {
          ...prev,
          [type]: {
            quantity: 1,
            checkIn: "",
            checkOut: "",
          },
        };
      } else {
        const newDetails = { ...prev };
        delete newDetails[type];
        return newDetails;
      }
    });
  };

  
const handleBook = async () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (!token || !user?.name || !user?.email || !user?._id) {
    console.warn("⚠️ Missing user info or token:", { token, user });
    alert("Please log in to book.");
    return;
  }

  const selectedRoomType = Object.keys(bookingDetails)[0];
  const room = hotel?.rooms.find((r) => r.type === selectedRoomType);

  if (!selectedRoomType || !room) {
    console.warn("⚠️ No room selected or room not found:", { selectedRoomType, hotel });
    alert("Please select a room.");
    return;
  }

  const { checkIn, checkOut, quantity } = bookingDetails[selectedRoomType];

  if (!checkIn || !checkOut) {
    console.warn("⚠️ Missing check-in or check-out dates:", { checkIn, checkOut });
    alert("Please select check-in and check-out dates.");
    return;
  }

  // ✅ Step 1: Calculate number of nights
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  const numberOfNights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  console.log("🛏️ Nights between dates:", {
    checkIn,
    checkOut,
    numberOfNights,
    timeDiffInMs: timeDiff,
  });

  if (numberOfNights <= 0) {
    console.warn("⚠️ Invalid number of nights:", numberOfNights);
    alert("Check-out must be after check-in.");
    return;
  }

  // ✅ Step 2: Calculate total price
  const roomQuantity = quantity || 1;
  const roomPrice = room.price;

  const totalPrice = numberOfNights * roomPrice * roomQuantity;

  console.log("💰 Price calculation breakdown:");
  console.log(`   🛏️ Room price per night: ${roomPrice}`);
  console.log(`   🔢 Quantity of rooms: ${roomQuantity}`);
  console.log(`   📅 Number of nights: ${numberOfNights}`);
  console.log(`   💵 Total price = ${roomPrice} x ${roomQuantity} x ${numberOfNights} = ${totalPrice}`);

  // ✅ Step 3: Create payload
  const payload = {
    hotelId,
    roomType: selectedRoomType,
    checkIn,
    checkOut,
    price: totalPrice,
    productName: hotel?.name,
    userName: user.name,
    userEmail: user.email,
    userId: user._id,
  };

  console.log("📤 Sending checkout payload:", payload);

  try {
    const stripeRes = await axios.post(`${API_BASE_URL}/checkout`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("✅ Stripe session created:", stripeRes.data);

    if (stripeRes.data.url) {
      console.log("🔁 Redirecting to Stripe Checkout URL:", stripeRes.data.url);
      window.location.href = stripeRes.data.url;
    } else {
      console.error("❌ No redirect URL from Stripe:", stripeRes.data);
      alert("Stripe checkout failed.");
    }
  } catch (error: any) {
    console.error("❌ Error during booking:", error.message || error);
    alert("Something went wrong during booking.");
  }
};






  if (!hotel) return <div>Loading...</div>;

  return (
    <div className="booking-page">
      <h1>{hotel.name}</h1>
      <p>{hotel.location}</p>
      <img src={hotel.mainImage} alt={hotel.name} className="main-image" />

      <h2>Select Room Types:</h2>
      <div className="room-list">
        {hotel.rooms.map((room, index) => (
          <div key={index} className="room-card">
            <img src={room.images[0]} alt={room.type} className="room-image" />

            <div className="room-info">
              <h3>{room.type}</h3>
              <p>${room.price} per night</p>

              <div className="room-select">
                <label>
                  <input
                    type="checkbox"
                    checked={!!bookingDetails[room.type]}
                    onChange={(e) =>
                      handleCheckboxChange(room.type, e.target.checked)
                    }
                  />
                  Select Room
                </label>

                {bookingDetails[room.type] && (
                  <div className="room-quantity">
                    <label>
                      Quantity:
                      <input
                        type="number"
                        min="1"
                        value={bookingDetails[room.type].quantity}
                        onChange={(e) =>
                          handleRoomQuantityChange(
                            room.type,
                            parseInt(e.target.value) || 1
                          )
                        }
                      />
                    </label>

                    <label>
                      Check-in:
                      <input
                        type="date"
                        value={bookingDetails[room.type].checkIn}
                        onChange={(e) =>
                          handleDateChange(room.type, "checkIn", e.target.value)
                        }
                      />
                    </label>

                    <label>
                      Check-out:
                      <input
                        type="date"
                        value={bookingDetails[room.type].checkOut}
                        onChange={(e) =>
                          handleDateChange(
                            room.type,
                            "checkOut",
                            e.target.value
                          )
                        }
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="book-btn" onClick={handleBook}>
        Book Now
      </button>
    </div>
  );
}
