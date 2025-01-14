import express from 'express';
import routes from './routes/index.js';
import { connectDb } from './db/index.js';
import dotenv from 'dotenv';
dotenv.config();
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

import admin  from 'firebase-admin';
import cors from 'cors';

const serviceAccount = JSON.parse(fs.readFileSync(path.join(dirname(fileURLToPath(import.meta.url)), '../sewarproject-7bc35-firebase-adminsdk-pnhw7-90f1b1d77e.json'), 'utf8'));


const app = express(); 
const PORT = process.env.PORT || 3000;

 
 

// Middleware
app.use(cors()); 
app.use(express.json());
app.use(routes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});


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
