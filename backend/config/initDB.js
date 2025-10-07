/**
* This file initializes the database using Sequelize.
*
* Purpose:
* - Verify that the connection to the PostgreSQL database is working.
* - Synchronize the Sequelize models with the database (create and update tables).
* - Handle any errors properly and close the connection if necessary.
*
* Main steps:
* 1. Authentication: Verifies that Sequelize can connect to the database.
* 2. Synchronization: Creates or updates tables based on the imported models.
* 3. Error handling: Captures exceptions, displays error messages, and closes the connection properly.
* 4. Automatic execution: The initialization function is called directly at the end of the script.
*/
import { sequelize } from './db.js';
import User from '../models/userModel.js';
import Pro from '../models/proModel.js';
import Patient from "../models/patientModel.js";

// Asynchronous database initialization function
async function initDB() {
  try {
		// Check that a connection to the database is possible
		await sequelize.authenticate();

		// Synchronizes the models with the database:
		// - creates the tables if they don't exist
		// - { alter: true } updates the columns to match the model definitions (without dropping the table)
		await sequelize.sync({alter: true});
	} catch (err) {
		// If an error occurs, we display it
		console.log(`Error DB : ${err.message}`);
		try {
			// Properly closes the database connection, even in case of an error
			await sequelize.close();
			console.log('Database connection closed successfully');
		} catch (closeErr) {
			console.log('Error while closing the connection');
		}
		// Properly closes the server
			process.exit(1);
	}
}
// We directly execute the initialization function
initDB();
