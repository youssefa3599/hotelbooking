const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';
const corsOptions = {
    origin: (origin, callback) => {
        console.log(`🔍 [CORS] Origin requested: ${origin}`);
        if (!origin || origin === CLIENT_URL) {
            console.log(`✅ [CORS] Allowed origin: ${origin}`);
            callback(null, CLIENT_URL); // ✅ EXPLICITLY RETURN STRING (NOT `true`)
        }
        else {
            console.warn(`❌ [CORS] Blocked origin: ${origin}`);
            callback(new Error(`CORS policy: Origin ${origin} not allowed`));
        }
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
};
export default corsOptions;
