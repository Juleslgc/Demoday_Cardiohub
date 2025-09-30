/**
 * Main application entry point.
 *
 * - Loads environment variables with dotenv.
 * - Initializes an Express server.
 * - Configures middleware (JSON body parsing).
 * - Registers API routes.
 * - Initializes the database before starting the server.
 *
 * Notes:
 * - Routes are mounted under `/api/auth`.
 * - The server only starts after a successful DB connection.
 * - Uses a port defined in environment variables or defaults to 3000.
 */

import express from "express";
import dotenv from "dotenv";
import { initDB } from "./config/initDB.js";
import signUpRoutes from "./routes/signUpRoutes.js";

dotenv.config();
const app = express(); // Initialize an Express application

// Middleware to parse JSON in incoming requests
app.use(express.json());

// Register routes under /api/auth
app.use("/api/auth", signUpRoutes);

// Define server port (from environment or fallback to 3000)
const PORT = process.env.PORT || 3000;

// Initialize database connection before launching the server
initDB().then(() => {
	app.listen(PORT, () => {
		console.log(`Server launched on port ${PORT}`);
	});
});
