import { sequelize } from './db.js';
import User from '../models/userModel.js';
import Pro from '../models/proModel.js';

async function initDB() {
  try {
		// Check that a connection to the database is possible
		await sequelize.authenticate();
		console.log('Connection OK');

		// Synchronizes the models with the database:
		// - creates the tables if they don't exist
		// - { alter: true } updates the columns to match the model definitions (without dropping the table)
		await sequelize.sync({alter: true});
		console.log('Tables created !');
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
