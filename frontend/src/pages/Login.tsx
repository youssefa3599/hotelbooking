import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/auth/login", { email, password });

      console.log("✅ Login success:", res.data);

      // ✅ Adapt to the actual structure from backend
      const user = res.data;
      const token = user.token;

      if (!token || !user.role) {
        console.error("❌ Invalid login response:", res.data);
        return;
      }

      // ✅ Save token and user separately
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      console.log("🔐 Saved token and user in localStorage");

      // ✅ Role-based redirect
      if (user.role === "admin") {
        navigate("/admin");
      } else if (user.role === "user") {
        navigate("/dashboard");
      } else {
        console.error("❌ Unknown user role:", user.role);
      }
    } catch (err: any) {
      console.error("❌ Login failed:", err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
