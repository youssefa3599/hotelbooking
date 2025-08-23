// src/pages/UserProfile.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import "./UserProfile.css"; // ← import the CSS


// ✅ Use Vite-style env var
const API_BASE_URL = import.meta.env.VITE_API_URL;

interface User {
  name: string;
  email: string;
}

export default function UserProfile() {
  const [user, setUser] = useState<User>({ name: "", email: "" });
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  // 🔄 Load user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      const updateData: any = {
        name: user.name,
        email: user.email,
      };

      if (newPassword.trim() !== "") {
        updateData.password = newPassword;
      }

      const url = `${API_BASE_URL}/auth/profile`;
      console.log("🌐 Sending profile update to:", url);

      const response = await axios.put(url, updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.setItem("user", JSON.stringify(response.data));
      setMessage("✅ Profile updated successfully!");
    } catch (error) {
      console.error("❌ Failed to update profile", error);
      setMessage("❌ Something went wrong");
    }
  };

  return (
    
  <div className="user-profile-container">
    <div className="user-profile-card">
      <h2>🧑‍💼 Your Profile</h2>

      <input
        type="text"
        placeholder="Name"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />

      <input
        type="email"
        placeholder="Email"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="New Password (optional)"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
      />

      <button onClick={handleUpdate}>Update Profile</button>

      {message && <p>{message}</p>}
    </div>
  </div>
);
}