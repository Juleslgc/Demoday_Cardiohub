/**
* This file configures and initializes the connection to the PostgreSQL database
* using Sequelize, an ORM (Object-Relational Mapping) for Node.js.
*
* Main steps:
* 1. Load environment variables from the `.env` file using dotenv.
* This keeps sensitive information (database name, login, password, host, etc.)
* out of the source code.
*
* 2. Create a Sequelize instance with the parameters defined in the `.env` file.
* This instance represents the connection to the PostgreSQL database and will be used
* throughout the application to interact with the database (models, queries, etc.).
*
* In summary: This file prepares the secure connection to the PostgreSQL database
* and exports the `sequelize` object for use elsewhere in the project.
*/
import { Sequelize } from "sequelize";
import dotenv from "dotenv";

// Load the .env file: the variables become accessible via process.env
dotenv.config();

// Create a Sequelize instance that represents the connection to PostgreSQL
export const sequelize = new Sequelize({
  database: process.env.DB_NAME, // Database name
  username: process.env.DB_USER, // Database username
  password: process.env.DB_PASSWORD, // Associated password
  host: process.env.DB_HOST, // Database server address
  port: process.env.DB_PORT, // Connection port
  dialect: "postgres", // Base type used: here PostgreSQL
  timezone: "+02:00", // France time zone
});
