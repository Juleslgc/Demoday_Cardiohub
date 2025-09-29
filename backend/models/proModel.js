import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import BaseModel, { baseModel } from "./baseModel.js";

// Definition of the Pro model, which inherits from BaseModel
export default class Pro extends BaseModel {}

// Initialize the Pro model
Pro.init(
  {
		...baseModel, // Retrieves the common attributes (here, the UUID ID)
		lastName: { type: DataTypes.STRING(100), allowNull: false,
			validate: {
				notEmpty: {
					msg: 'LastName cannot be empty'
				},
				isString(value) {
					if (typeof value !== 'string') {
						throw new Error('LastName must be a string');
					}},},},

		firstName: { type: DataTypes.STRING(100), allowNull: false, 
			validate: {
				isString(value) {
					if (typeof value !== 'string') {
						throw new Error('FirstName must be a string');
					}},
				notEmpty: {
					msg: 'FirstName cannot be empty'
    		},},},

		rpps: { type: DataTypes.STRING(11), allowNull: false, unique: true, validate: {
      is: /^\d{11}$/,
			notEmpty: {
				msg: 'RPPS cannot be empty'
    	},},},

		institution: { type: DataTypes.STRING, allowNull: false, 
			validate: {
				isString(value) {
					if (typeof value !== 'string') {
						throw new Error('Institution must be a string');
					}},
				notEmpty: {
      		msg: 'Institution cannot be empty'
    		},},},

		role: { type: DataTypes.STRING, allowNull: false, 
			validate: {
				isString(value) {
					if (typeof value !== 'string') {
						throw new Error('Role must be a string');
					}},
				notEmpty: {
      		msg: 'Role cannot be empty'
    		},},},

		speciality: { type: DataTypes.STRING, allowNull: false, 
			validate: {
				isString(value) {
					if (typeof value !== 'string') {
						throw new Error('Speciality must be a string');
					}},
				notEmpty: {
      		msg: 'Speciality cannot be empty'
    		},},
		},
	},
	{
		sequelize,
		modelName: 'Pro', // Internal name of the Sequelize model
		tableName: 'pros', // Table name in the database
		timestamps: true, // Automatically adds createdAt and updatedAt fields
	}
);
