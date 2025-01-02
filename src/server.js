import express from 'express';
import routes from './routes/index.js';
import { connectDb } from './db/index.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import admin from 'firebase-admin';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Constants
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

// Firebase service account
const serviceAccount = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../sewarproject-7bc35-firebase-adminsdk-pnhw7-90f1b1d77e.json'),
    'utf8'
  )
);

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'sewarproject-7bc35.appspot.com',
});

export const bucket = admin.storage().bucket();

const app = express();

// Middleware
app.use(cors({ origin: '*' })); 
app.use(express.json());

app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const startServer = async () => {
  try {
    await connectDb(); 
    console.log('Connected to MongoDB');

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); 
  }
};

// Start the server
startServer();