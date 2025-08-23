import { useState } from "react";
import axios from "axios";
import "./HotelForm.css";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

interface Room {
  type: string;
  price: number;
  quantity: number;
  images: string[];
}

export default function HotelForm() {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [mainImage, setMainImage] = useState("");
  const [rooms, setRooms] = useState<Room[]>([
    { type: "", price: 0, quantity: 1, images: [] },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log("📸 Main image selected:", file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      console.log("⬆️ Uploading main image to Cloudinary...");
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      console.log("✅ Main image uploaded:", res.data.secure_url);
      setMainImage(res.data.secure_url);
    } catch (err) {
      console.error("❌ Failed to upload main image:", err);
    }
  };

  const handleRoomImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log(`📸 Room image selected for room ${index}:`, file);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      console.log(`⬆️ Uploading room ${index} image to Cloudinary...`);
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      console.log(`✅ Room image uploaded for room ${index}:`, res.data.secure_url);
      const updatedRooms = [...rooms];
      updatedRooms[index].images.push(res.data.secure_url);
      setRooms(updatedRooms);
    } catch (err) {
      console.error(`❌ Failed to upload room image for room ${index}:`, err);
    }
  };

  const handleRoomChange = <K extends keyof Room>(
    index: number,
    field: K,
    value: Room[K]
  ) => {
    const updatedRooms = [...rooms];
    updatedRooms[index] = {
      ...updatedRooms[index],
      [field]: value,
    };
    setRooms(updatedRooms);
  };

  const handleAddRoom = () => {
    console.log("➕ Adding new room input");
    setRooms([...rooms, { type: "", price: 0, quantity: 1, images: [] }]);
  };

  const handleRemoveRoom = (index: number) => {
    console.log(`🗑️ Removing room at index ${index}`);
    const updatedRooms = rooms.filter((_, i) => i !== index);
    setRooms(updatedRooms);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("❌ No token found");
      setIsSubmitting(false);
      return;
    }

    console.log("📤 Submitting hotel with data:");
    console.log({ name, location, description, mainImage, rooms });

    try {
      const res = await axios.post(
        `${API_BASE_URL}/hotels`,
        {
          name,
          location,
          description,
          mainImage,
          rooms,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Hotel created:", res.data);
      setName("");
      setLocation("");
      setDescription("");
      setMainImage("");
      setRooms([{ type: "", price: 0, quantity: 1, images: [] }]);
    } catch (err) {
      console.error("❌ Failed to create hotel:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="hotel-form-container">
      <h2>Create Hotel</h2>
      <form className="hotel-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Hotel Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Hotel Main Image</label>
        <input type="file" accept="image/*" onChange={handleMainImageUpload} required />
        {mainImage && <img src={mainImage} alt="Main Preview" style={{ width: 120, marginTop: 8 }} />}

        <hr />
        <h3>Rooms</h3>
        {rooms.map((room, index) => (
          <div key={index} className="room-group">
            <input
              type="text"
              placeholder="Room Type"
              value={room.type}
              onChange={(e) => handleRoomChange(index, "type", e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Price"
              value={room.price}
              min={0}
              onChange={(e) =>
                handleRoomChange(index, "price", parseFloat(e.target.value))
              }
              required
            />
            <input
              type="number"
              placeholder="Quantity"
              value={room.quantity}
              min={1}
              onChange={(e) =>
                handleRoomChange(index, "quantity", parseInt(e.target.value))
              }
              required
            />
            <label>Upload Room Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleRoomImageUpload(e, index)}
            />
            {room.images.length > 0 && (
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                {room.images.map((img, i) => (
                  <img key={i} src={img} alt={`Room ${i}`} style={{ width: "80px" }} />
                ))}
              </div>
            )}
            <button type="button" onClick={() => handleRemoveRoom(index)}>
              Remove Room
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddRoom}>Add Room</button>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Hotel"}
        </button>
      </form>
    </div>
  );
}
