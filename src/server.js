// const express = require('express');
import express from 'express';
import rateLimiter from './middleware/rateLimiter.js';
import transactionsRoute from './routes/transactionsRoute.js'; 
import { connectToDatabase } from './config/db.js'; // Adjust the import path as necessary
import job from './config/cron.js'; // Adjust the import path as necessary


const app = express();

if (process.env.NODE_ENV === 'production') job.start(); // Start the cron job if in production environment

// Middleware 
app.use(express.json()); 
app.use(rateLimiter); // Apply rate limiting middleware



const PORT = process.env.PORT || 5001;



app.get("/health", (req, res) => {
    res.send("Hello World");
});


app.use("/api/transactions",transactionsRoute); // Use the transactions route


connectToDatabase().then(() => {
    console.log("Connected to the database successfully");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
