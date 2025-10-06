/**
* Sequelize Model: `User`
*
* This model represents a **user** in the application.
* It inherits from `BaseModel` to benefit from common fields (like `id`).
*
* Purpose:
* - Define the structure of the `users` table in the PostgreSQL database.
* - Store a user's login information (email, password).
*
* Main fields:
* - `id`: Unique identifier (UUID), inherited from `baseModel`.
* - `email`: Unique email address, used for authentication.
* - `password`: Password encrypted with bcrypt before saving.
*
* Model options:
* - `modelName`: Internal name used by Sequelize.
* - `tableName`: Actual name of the table in the database. * - `timestamps`: Automatically adds `createdAt` and `updatedAt`.
*/
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import BaseModel, { baseModel } from "./baseModel.js";

// Defining the model by inheriting from BaseModel
export default class User extends BaseModel {}

// Model initialization
User.init(
	{
		...baseModel, // Include common fields (UUID ID, possibly others)
		email: { type: DataTypes.STRING, allowNull: false, unique: true }, // Each user must have a unique email
		password: { type: DataTypes.STRING, allowNull: false },
	},
	{
		sequelize, // Connect to the database
		modelName: 'User', // Internal model name for Sequelize
		tableName: 'users', // Actual name of the table in the database
		timestamps: true, // Automatically create createdAt and updatedAt fields
	}
);