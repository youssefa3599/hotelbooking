// routes/hotelRoutes.ts
import express from 'express';
import { getAllHotels, getHotelById, createHotel, deleteHotel, updateHotel, // ✅ NEW: Import updateHotel controller
 } from '../controllers/hotelController.js';
import { protect } from '../middleware/authMiddleware.js'; // 🛡️ auth middleware
const router = express.Router();
// 🌐 Middleware to log all requests hitting /api/hotels
router.use((req, res, next) => {
    console.log(`📢 [hotelRoutes] ${req.method} ${req.originalUrl}`);
    next();
});
// 🟢 Public routes
router.get('/', (req, res, next) => {
    console.log('➡️ getAllHotels route called');
    next();
}, getAllHotels);
router.get('/:id', (req, res, next) => {
    console.log(`➡️ getHotelById route called with id: ${req.params.id}`);
    next();
}, getHotelById);
// 🔒 Protected routes
router.post('/', (req, res, next) => {
    console.log('➡️ POST /api/hotels createHotel route called');
    next();
}, protect, (req, res, next) => {
    console.log(`🔐 User ${req.user?.email} is authenticated, proceeding to createHotel`);
    next();
}, createHotel);
router.put('/:id', (req, res, next) => {
    console.log(`➡️ PUT /api/hotels/${req.params.id} updateHotel route called`);
    next();
}, protect, (req, res, next) => {
    console.log(`🔐 User ${req.user?.email} is authenticated, proceeding to updateHotel`);
    next();
}, updateHotel); // ✅ NEW: Edit hotel
router.delete('/:id', (req, res, next) => {
    console.log(`➡️ DELETE /api/hotels/${req.params.id} deleteHotel route called`);
    next();
}, protect, (req, res, next) => {
    console.log(`🔐 User ${req.user?.email} is authenticated, proceeding to deleteHotel`);
    next();
}, deleteHotel);
export default router;
