// routes/checkoutRoutes.ts
import express from 'express';
import { createCheckoutSession } from '../controllers/checkoutController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.post('/', protect, createCheckoutSession); // ✅ Fix applied
export default router;
