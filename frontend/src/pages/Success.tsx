import React from "react";
import { Link } from "react-router-dom";

export default function Success() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-50 text-center p-4">
      <h1 className="text-4xl font-bold text-green-700 mb-4">🎉 Booking Successful!</h1>
      <p className="text-lg text-green-800 mb-6">
        Thank you for booking with us. A confirmation has been sent to your email.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Back to Home
      </Link>
    </div>
  );
}
