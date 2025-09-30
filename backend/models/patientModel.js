/**
 * Patient model definition.
 *
 * - Extends BaseModel to inherit shared fields (e.g., UUID primary key).
 * - Defines specific attributes for patients (name, birth date, email, etc.).
 * - Uses Sequelize scopes to exclude sensitive fields (e.g., password) by default.
 * - Provides a custom toJSON() method to ensure password is never exposed in API responses.
 *
 * Notes:
 * - Email is unique and validated against a standard email format.
 * - Default scope excludes password in queries, but `withPassword` scope allows including it when necessary.
 * - Timestamps (createdAt, updatedAt) are enabled automatically.
 */

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import BaseModel, { baseModel } from "./baseModel.js";

class Patient extends BaseModel {
  // Customize JSON serialization to hide sensitive data
  toJSON() {
    // Get all attributes of the instance
    const attributes = {...this.get() };
    delete attributes.password; // Remove password field
    return attributes;
  }
}

Patient.init(
	{
			...baseModel, // ajoute id: UUID
			lastName: { type: DataTypes.STRING(100), allowNull: false },
			firstName: { type: DataTypes.STRING(100), allowNull: false },
			birthDate: { type: DataTypes.DATE, allowNull: false },
			email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: { msg: "Email non valide" } }},
			password: { type: DataTypes.STRING, allowNull: false },
			address: { type: DataTypes.TEXT, allowNull: true },
			phone: { type: DataTypes.STRING(10), allowNull: true },
	},
	{
		sequelize,
    modelName: "Patient",
    tableName: "patients",
    timestamps: true, // Adds createdAt and updatedAt fields

    // Default scope: exclude password from query results
    defaultScope: {
      attributes: { exclude: ["password"] },
    },

    // Explicit scope: allow including password when needed (e.g., authentication)
    scopes: {
      withPassword: {
        attributes: { include: ["password"] },
      },
    },
	}
);

export default Patient;
