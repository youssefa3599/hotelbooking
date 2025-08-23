// src/controllers/webhookController.ts
import Stripe from "stripe";
import dotenv from "dotenv";
import Booking from "../models/Booking.js";
dotenv.config();
const stripe = new Stripe(process.env.STRIPE_API_KEY, {
    apiVersion: "2022-11-15",
});
export const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        console.log("✅ Stripe webhook verified:", event.type);
    }
    catch (err) {
        console.error("❌ Stripe webhook signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    // Only handle successful payments
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        console.log("📦 Checkout Session Metadata:", session.metadata);
        if (!session.metadata) {
            console.warn("⚠️ Metadata missing from Stripe session.");
            return res.status(400).send("Missing metadata.");
        }
        const { userId, userName, userEmail, hotelId, roomType, checkInDate, checkOutDate, } = session.metadata;
        if (!userId || !hotelId || !roomType || !checkInDate || !checkOutDate || !userName || !userEmail) {
            console.error("❌ Missing one or more required metadata fields:", {
                userId,
                hotelId,
                roomType,
                checkInDate,
                checkOutDate,
                userName,
                userEmail,
            });
            return res.status(400).send("Missing metadata fields");
        }
        try {
            const newBooking = await Booking.create({
                user: userId, // <-- this must match the schema field exactly
                hotelId: hotelId, // likely also needs renaming
                roomType,
                checkInDate: new Date(checkInDate),
                checkOutDate: new Date(checkOutDate),
                userName,
                userEmail,
                stripeSessionId: session.id,
            });
            console.log("✅ Booking saved to DB:", newBooking);
        }
        catch (err) {
            console.error("❌ Error creating booking in DB:", err.message);
            return res.status(500).send("Booking creation failed");
        }
    }
    res.status(200).json({ received: true });
};
