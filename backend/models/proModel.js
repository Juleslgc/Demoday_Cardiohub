import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import BaseModel, { baseModel } from "./baseModel.js";

// Definition of the Pro model, which inherits from BaseModel
export default class Pro extends BaseModel {}

// Initialize the Pro model
Pro.init(
  {
		...baseModel, // Retrieves the common attributes (here, the UUID ID)
		lastName: { type: DataTypes.STRING(100), allowNull: false },
		firstName: { type: DataTypes.STRING(100), allowNull: false },
		rpps: { type: DataTypes.STRING(11), allowNull: false, unique: true },
		institution: { type: DataTypes.STRING, allowNull: false },
		role: { type: DataTypes.STRING, allowNull: false },
		specility: { type: DataTypes.STRING, allowNull: false },
	},
	{
		sequelize,
		modelName: 'Pro', // Internal name of the Sequelize model
		tableName: 'pros', // Table name in the database
		timestamps: true, // Automatically adds createdAt and updatedAt fields
	}
);
