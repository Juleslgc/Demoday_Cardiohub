import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load the .env file: the variables become accessible via process.env
dotenv.config({ path: '../.env' });

// Create a Sequelize instance that represents the connection to PostgreSQL
export const sequelize = new Sequelize({
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: "postgres",
});
