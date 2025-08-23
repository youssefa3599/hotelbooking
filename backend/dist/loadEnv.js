import dotenv from 'dotenv';
import path from 'path';
const envPath = path.resolve(process.cwd(), '.env');
const result = dotenv.config({ path: envPath });
if (result.error) {
    throw result.error;
}
console.log('✅ .env loaded, STRIPE_API_KEY =', process.env.STRIPE_API_KEY);
