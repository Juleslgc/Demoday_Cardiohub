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
import cors from "cors";
import { initDB } from "./config/initDB.js";
import patientRoutes from "./routes/patientRoutes.js";

dotenv.config();
const app = express(); // Initialize an Express application

// Allow calls from the front
app.use(cors({
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE"],
	allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware to parse JSON in incoming requests
app.use(express.json());

// Register routes under /api/auth
app.use("/api/auth", patientRoutes);

// Define server port (from environment or fallback to 3000)
const PORT = process.env.PORT || 3000;

// Initialize database connection before launching the server
initDB().then(() => {
	app.listen(PORT, "0.0.0.0", () => {
		console.log(`Server launched and accessible at http://0.0.0.0:${PORT}`);
	});
});
