import express from 'express';
import { stripeWebhook } from '../controllers/webhookController.js';

const router = express.Router();

// Stripe requires raw body
router.post('/', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;
