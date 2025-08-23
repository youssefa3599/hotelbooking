import express from "express";
import { createBooking, getAllBookings, getUserBookings, createUnpaidBooking, // ✅ Import the new controller
 } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
// 🔒 Protected routes
router.post("/", protect, createBooking);
router.post("/create-unpaid", createUnpaidBooking);
router.get("/", protect, getAllBookings);
// ✅ Add this route to return bookings for the logged-in user
router.get("/my", protect, getUserBookings);
export default router;
