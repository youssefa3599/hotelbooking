import mongoose, { Schema, Document } from 'mongoose';

export interface IRoom {
  type: string;
  price: number;
  quantity: number;
  images: string[];
}

export interface IHotel extends Document {
  name: string;
  location: string;
  description: string;
  mainImage: string; // ✅ fixed
  rooms: IRoom[];
}

const RoomSchema = new Schema<IRoom>({
  type: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  images: { type: [String], required: true },
});

const HotelSchema = new Schema<IHotel>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  mainImage: { type: String, required: true }, // ✅ updated here
  rooms: { type: [RoomSchema], required: true },
});

export default mongoose.model<IHotel>('Hotel', HotelSchema);
