import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import userRoutes from './routes/userRoutes.js';
import hotelRoutes from './routes/hotelRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import checkoutRoutes from './routes/checkoutRoutes.js';
import { stripeWebhook } from './controllers/webhookController.js';
import corsOptions from './config/corsConfig.js';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 5000;
// Debug all incoming requests
app.use((req, res, next) => {
    console.log(`➡️ ${req.method} ${req.originalUrl} from ${req.headers.origin || 'local'}`);
    next();
});
// Stripe webhook must come BEFORE express.json()
app.post('/api/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
// Other middleware
app.use(cors(corsOptions));
app.use(express.json());
// Mount routes
console.log("🔗 Mounting routes...");
app.use('/api/auth', userRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/checkout', checkoutRoutes);
// Root
app.get('/', (_req, res) => {
    console.log("📡 Root route hit");
    res.send('🏨 Hotel Booking API running');
});
// 404 handler
app.use((req, res) => {
    console.warn(`❌ [404] Not found: ${req.method} ${req.originalUrl}`);
    res.status(404).json({ error: 'Route not found' });
});
// Error handler
app.use((err, _req, res, _next) => {
    console.error('🔥 [Error]', err.message || err);
    if (err.message?.includes('CORS')) {
        res.status(403).json({ error: 'CORS policy error', detail: err.message });
    }
    else {
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Connect DB and start server
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
    .catch((err) => {
    console.error('❌ DB connection error:', err.message);
    process.exit(1);
});
