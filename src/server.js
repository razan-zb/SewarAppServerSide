import express from 'express';
import routes from './routes/index.js';
import { connectDb } from './db/index.js';
import dotenv from 'dotenv';
dotenv.config();

import admin  from 'firebase-admin';
import cors from 'cors';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

const app = express(); 
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); 
app.use(express.json());
app.use(routes);
// Firebase connection
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "sewarproject-7bc35.appspot.com" 
});

export const bucket = admin.storage().bucket();
// Connect to the database and start the server
const startServer = async () => {
  try {
    await connectDb(); // Connect to MongoDB    
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.listen(PORT, () => {
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1); // Exit the process with an error code
  }
};
startServer();
