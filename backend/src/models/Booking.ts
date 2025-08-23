import mongoose, { Schema, Document } from "mongoose";

// ✅ Log when the model file is loaded
console.log("📦 Booking model loaded");

export interface BookingDocument extends Document {
  user: mongoose.Types.ObjectId;
  hotelId: mongoose.Types.ObjectId;
  roomType: string;
  userName: string;
  userEmail: string;
  checkInDate: Date;
  checkOutDate: Date;
  status: "unpaid" | "paid";
}

const bookingSchema = new Schema<BookingDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    hotelId: { type: Schema.Types.ObjectId, ref: "Hotel", required: true },
    roomType: { type: String, required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
    },
  },
  { timestamps: true }
);

// ✅ Debug when a save is triggered
bookingSchema.pre("save", function (next) {
  console.log("💾 Booking save triggered with data:", this);
  next();
});

// ✅ Debug after save is successful
bookingSchema.post("save", function (doc) {
  console.log("✅ Booking saved successfully with ID:", doc._id);
});

const Booking = mongoose.model<BookingDocument>("Booking", bookingSchema);

export default Booking;
