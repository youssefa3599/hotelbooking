// routes/userRoutes.ts
import express from "express";
import { registerUser, loginUser, updateUserProfile, } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();
// 🧍 Register
router.post("/register", async (req, res, next) => {
    console.log("📡 [ROUTE] POST /api/auth/register hit");
    console.log("🧾 [Payload] Register Request Body:", req.body);
    try {
        await registerUser(req, res);
        console.log("✅ [ROUTE] Register handled successfully");
    }
    catch (err) {
        console.error("❌ [ROUTE] Error in Register Route:", err);
        next(err);
    }
});
// 🔐 Login
router.post("/login", async (req, res, next) => {
    console.log("📡 [ROUTE] POST /api/auth/login hit");
    console.log("🧾 [Payload] Login Request Body:", req.body);
    try {
        await loginUser(req, res);
        console.log("✅ [ROUTE] Login handled successfully");
    }
    catch (err) {
        console.error("❌ [ROUTE] Error in Login Route:", err);
        next(err);
    }
});
// 👤 Update Profile (Requires Auth)
router.put("/profile", protect, async (req, res, next) => {
    console.log("📡 [ROUTE] PUT /api/auth/profile hit");
    try {
        await updateUserProfile(req, res);
        console.log("✅ [ROUTE] Profile updated successfully");
    }
    catch (err) {
        console.error("❌ [ROUTE] Error updating profile:", err);
        next(err);
    }
});
export default router;
