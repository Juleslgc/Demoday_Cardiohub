import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import BaseModel, { baseModel } from "./baseModel.js";

// Defining the model by inheriting from BaseModel
export default class User extends BaseModel {}

// Model initialization
User.init(
	{
		...baseModel, // Include common fields (UUID ID, possibly others)
		email: { type: DataTypes.STRING, allowNull: false, unique: true },
		password: { type: DataTypes.STRING, allowNull: false },
	},
	{
		sequelize,
		modelName: 'User', // Internal model name for Sequelize
		tableName: 'users', // Actual name of the table in the database
		timestamps: true, // Automatically create createdAt and updatedAt fields
	}
);