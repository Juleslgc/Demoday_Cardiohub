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
					msg: 'Le champ Nom est obligatoire.'
				},
				isString(value) {
					if (typeof value !== 'string') {
						throw new Error('Le champ Nom doit être une chaîne de caractères.');
					}},},},

		firstName: { type: DataTypes.STRING(100), allowNull: false, 
			validate: {
				isString(value) {
					if (typeof value !== 'string') {
						throw new Error('Le champ Prénom doit être une chaîne de caractères.');
					}},
				notEmpty: {
					msg: 'Le champ Prénom est obligatoire.'
    		},},},

		rpps: { type: DataTypes.STRING(11), allowNull: false, unique: true, validate: {
      is: /^\d{11}$/,
			notEmpty: {
				msg: 'Le champ RPPS est obligatoire.'
    	},},},

		institution: { type: DataTypes.STRING, allowNull: false, 
			validate: {
				isString(value) {
					if (typeof value !== 'string') {
						throw new Error('Le champ Établissement doit être une chaîne de caractères.');
					}},
				notEmpty: {
      		msg: 'Le champ Établissement est obligatoire.'
    		},},},

		role: { type: DataTypes.STRING, allowNull: false, 
			validate: {
				isString(value) {
					if (typeof value !== 'string') {
						throw new Error('Le champ Rôle doit être une chaîne de caractères.');
					}},
				notEmpty: {
      		msg: 'Le champ Rôle est obligatoire.'
    		},},},

		speciality: { type: DataTypes.STRING, allowNull: false, 
			validate: {
				isString(value) {
					if (typeof value !== 'string') {
						throw new Error('Le champ Spécialité doit être une chaîne de caractères.');
					}},
				notEmpty: {
      		msg: 'Le champ Spécialité est obligatoire.'
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
