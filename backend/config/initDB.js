/**
 * Database initialization module.
 *
 * - Tests the connection to PostgreSQL using Sequelize.
 * - Calls sequelize.sync() to create or synchronize database tables.
 * - Handles errors gracefully by closing the connection and stopping the process.
 *
 * Notes:
 * - Importing the models (e.g., Patient) is required so Sequelize registers them.
 * - Using { alter: true } updates existing tables to match the models.
 */

import sequelize from "./db.js";
import Patient from "../models/patientModel.js"; // Import the model so it gets registered

export const initDB = async () => {
	try {
		// Test the connection to the database
		await sequelize.authenticate();
		console.log("Connection to PostreSQL successful");

		// Synchronize models: create or update tables as needed
		await sequelize.sync({ alter: true });
		console.log("Database synchronized with Sequelize");
	} catch (error) {
		console.log("Critical error during DB initialization:", error);

		// Attempt to close the connection pool properly before exiting
		try {
			await sequelize.close();
			console.log("Connection to DB closed correctly");
		} catch (closeError) {
			console.error("Error closing connection:", closeError);
		}

		// Stop the server to avoid exposing an unusuable API
		process.exit(1);
	}
};
