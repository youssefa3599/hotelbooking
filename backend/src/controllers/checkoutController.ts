// src/controllers/checkoutController.ts

import dotenv from "dotenv";
dotenv.config();

import Stripe from "stripe";
import { Request, Response } from "express";

const stripe = new Stripe(process.env.STRIPE_API_KEY!, {
  apiVersion: "2022-11-15",
});

interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export const createCheckoutSession = async (req: AuthRequest, res: Response) => {
  const {
    hotelId,
    roomType,
    checkIn,
    checkOut,
    price,
    productName,
    userId,
    userName,
    userEmail,
  } = req.body;

  console.log("📥 Checkout session request received with payload:");
  console.log({
    hotelId,
    roomType,
    checkIn,
    checkOut,
    price,
    productName,
    userId,
    userName,
    userEmail,
  });

  // 🔍 Additional debug for price calculation
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
  const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

  console.log("📆 Calculated number of nights:", nights);
  console.log(`💰 Received total price: $${price}`);
  console.log(`🔄 Implied price per night: $${(price / nights).toFixed(2)}`);

  if (
    !hotelId ||
    !roomType ||
    !checkIn ||
    !checkOut ||
    !price ||
    !productName ||
    !userId ||
    !userName ||
    !userEmail
  ) {
    console.warn("⚠️ Missing required booking info");
    return res.status(400).json({ error: "Missing booking info" });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: productName,
            },
            unit_amount: price * 100, // convert dollars to cents
          },
          quantity: 1,
        },
      ],
      success_url: "http://localhost:5173/my-bookings",
      cancel_url: `http://localhost:5173/book/${hotelId}`,
      metadata: {
        userId,
        hotelId,
        roomType,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        userName,
        userEmail,
      },
    });

    console.log("✅ Stripe checkout session created successfully:");
    console.log(`🧾 Session ID: ${session.id}`);
    console.log(`🌐 Redirecting to URL: ${session.url}`);

    return res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error("❌ Error creating Stripe session:", error.message || error);
    return res.status(500).json({ error: "Failed to create Stripe session" });
  }
};
