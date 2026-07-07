import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env variables relative to server directory
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('Environment variables loaded successfully.');
