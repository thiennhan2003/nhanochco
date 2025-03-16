import mongoose from "mongoose";
import express from 'express';
import userRoutes from './routes/v1/userRoute';
import { env } from "./helpers/env.helper";
import cors from 'cors'; // Import cors
import dotenv from 'dotenv'; // Import dotenv

dotenv.config(); // Load .env file

const app = express();
app.use(cors()); // Enable CORS
app.use(express.json());

const PORT = env.PORT || 8080; // Default to 8080 if env.PORT is undefined

const mongooseDbOptions = {
    autoIndex: true, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4, // Use IPv4, skip trying IPv6
};
const MongoDB_URI = "mongodb://127.0.0.1:27017/Nha_Hang";
mongoose
    .connect(env.MongoDB_URI as string, mongooseDbOptions)
    .then(() => {
        console.log("Connected to MongoDB Successfully");
        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error("Failed to Connect to MongoDB", err);
    });

// Use routes
app.use('/api/v1', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        statusCode: err.status || 500,
        message: err.message || 'Internal Server Error',
    });
});
