import mongoose, { Schema } from 'mongoose';
const RoomSchema = new Schema({
    type: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 1 },
    images: { type: [String], required: true },
});
const HotelSchema = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    mainImage: { type: String, required: true }, // ✅ updated here
    rooms: { type: [RoomSchema], required: true },
});
export default mongoose.model('Hotel', HotelSchema);
