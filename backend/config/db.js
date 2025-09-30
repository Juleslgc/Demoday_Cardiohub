/**
 * Database connection module using Sequelize ORM.
 * 
 * - Loads environment variables via dotenv.
 * - Initializes a Sequelize instance configured for PostgreSQL.
 * - Exports the instance so it can be reused across the application.
 * 
 * Notes:
 * - Make sure required environment variables are set in .env (DB_NAME, DB_USER, DB_PASSWORD, DB_HOST).
 */

import { Sequelize } from "sequelize";
import dotenv from "dotenv";  // Import dotenv to load environment variables from a .env file

dotenv.config();  // Initialize dotenv

// Create and configure a Sequelize instance for PostgreSQL
const sequelize = new Sequelize(
	process.env.DB_NAME,              // Database name
	process.env.DB_USER,              // Databse username
	String(process.env.DB_PASSWORD),  // Database password (explicitly converted to string for safety)
	{
			host: process.env.DB_HOST,
			dialect: "postgres",
			logging: true,                // Enable SQL query logs
	}
);

export default sequelize;
