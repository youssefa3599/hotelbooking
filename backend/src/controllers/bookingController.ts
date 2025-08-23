import { Request, Response } from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";

// Extend Request to include user from auth middleware
interface AuthenticatedRequest extends Request {
  user?: { _id: string };
}

// Create Booking
export const createBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    console.log("📥 [POST /api/bookings] Incoming booking request:", req.body);

    const { hotelId, roomType, checkInDate, checkOutDate } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      console.warn("⚠️ Unauthorized: No user ID found in request");
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    if (!hotelId || !roomType || !checkInDate || !checkOutDate) {
      console.warn("⚠️ Missing booking fields:", { hotelId, roomType, checkInDate, checkOutDate });
      return res.status(400).json({ message: "Missing booking fields" });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      console.warn(`⚠️ Hotel not found: ${hotelId}`);
      return res.status(404).json({ message: "Hotel not found" });
    }

    const room = hotel.rooms.find((r) => r.type === roomType);
    if (!room) {
      console.warn(`⚠️ Room type not found in hotel: ${roomType}`);
      return res.status(400).json({ message: "Room type not found in hotel" });
    }

    const quantity = room.quantity || 1;

    const overlappingBookings = await Booking.countDocuments({
      hotelId: new mongoose.Types.ObjectId(hotelId),
      roomType,
      $or: [
        {
          checkInDate: { $lt: new Date(checkOutDate) },
          checkOutDate: { $gt: new Date(checkInDate) },
        },
      ],
    });

    console.log("🔍 Overlapping bookings:", overlappingBookings, "vs available:", quantity);

    if (overlappingBookings >= quantity) {
      console.warn("⚠️ Room not available for selected dates");
      return res.status(400).json({ message: "Room not available for selected dates" });
    }

    const booking = new Booking({
      hotelId,
      roomType,
      checkInDate,
      checkOutDate,
      user: userId,
    });

    console.log("💾 About to save booking:", booking);

    await booking.save();

    console.log("✅ Booking successfully saved:", booking);
    res.status(201).json(booking);
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get All Bookings (admin or debug)
export const getAllBookings = async (req: Request, res: Response) => {
  try {
    const bookings = await Booking.find().populate("user hotelId");
    res.status(200).json(bookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};

// Get Bookings for Logged-in User
export const getUserBookings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      console.warn("⚠️ Unauthorized: No user ID found in request");
      return res.status(401).json({ message: "Unauthorized: User ID missing" });
    }

    const bookings = await Booking.find({ user: userId }).populate("hotelId");

    console.log(`📦 Returning ${bookings.length} bookings for user ${userId}`);

    res.status(200).json(bookings);
  } catch (error) {
    console.error("❌ Error fetching user bookings:", error);
    res.status(500).json({ message: "Failed to fetch user bookings" });
  }
};

// Create Unpaid Booking (used for webhook/bookings before payment)
export const createUnpaidBooking = async (req: Request, res: Response) => {
  try {
    const { hotelId, roomType, checkInDate, checkOutDate, userName, userEmail } = req.body;

    if (!hotelId || !roomType || !checkInDate || !checkOutDate || !userName || !userEmail) {
      console.warn("⚠️ Missing unpaid booking fields:", req.body);
      return res.status(400).json({ message: "Missing booking fields" });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      console.warn(`⚠️ Hotel not found: ${hotelId}`);
      return res.status(404).json({ message: "Hotel not found" });
    }

    const room = hotel.rooms.find((r) => r.type === roomType);
    if (!room) {
      console.warn(`⚠️ Room type not found in hotel: ${roomType}`);
      return res.status(400).json({ message: "Room type not found in hotel" });
    }

    const booking = new Booking({
      hotelId,
      roomType,
      checkInDate,
      checkOutDate,
      userName,
      userEmail,
      status: "unpaid",
    });

    console.log("💾 About to save unpaid booking:", booking);

    await booking.save();

    console.log("📝 Unpaid booking successfully created:", booking._id);
    res.status(201).json({ bookingId: booking._id });
  } catch (error) {
    console.error("❌ Error creating unpaid booking:", error);
    res.status(500).json({ message: "Server error" });
  }
};
