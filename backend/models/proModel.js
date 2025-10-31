/**
* -------------------------------------------------------------------------
* patientModel.js
*
* -------------------------------------------------------------------------
*
* This model represents a **healthcare professional** in the database.
* It inherits from `BaseModel` to benefit from common fields (such as `id`).
*
* Purpose:
* - Define the structure of the `pros` table in PostgreSQL.
* - Validate data entered when creating or updating a professional.
*
* Main fields:
* - `id`: unique identifier (UUID), inherited from `baseModel`.
* - `lastName`, `firstName`: first and last name of the professional.
* - `rpps`: unique RPPS number (exactly 11 digits).
* - `institution`: affiliated institution.
* - `role`: professional's position or title.
* - `speciality`: medical or paramedical specialty. 
*
* Model options:
* - `modelName`: Internal name of the model used by Sequelize.
* - `tableName`: Name of the table in the PostgreSQL database.
* - `timestamps`: Automatically adds `createdAt` and `updatedAt`.
*/
import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import BaseModel, { baseModel } from "./baseModel.js";

// Definition of the Pro model, which inherits from BaseModel
export default class Pro extends BaseModel {}

// Initialize the Pro model
Pro.init(
  {
    ...baseModel, // Retrieves the common attributes (here, the UUID ID)
    // Last name of the professional
    lastName: { type: DataTypes.STRING(100), allowNull: false,
      validate: {
        notEmpty: {
          msg: "Le champ Nom est obligatoire."
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("Le champ Nom doit être une chaîne de caractères.");
          }},},},
    // First name of the professional
    firstName: { type: DataTypes.STRING(100), allowNull: false, 
      validate: {
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("Le champ Prénom doit être une chaîne de caractères.");
          }},
        notEmpty: {
          msg: "Le champ Prénom est obligatoire."
        },},},
    // RPPS number (11 digits required and unique)
    rpps: { type: DataTypes.STRING(11), allowNull: false, unique: true, validate: {
      is: /^\d{11}$/, // Regular expression: exactly 11 digits
      notEmpty: {
        msg: "Le champ RPPS est obligatoire."
      },},},
    // Institution of the professional
    institution: { type: DataTypes.STRING, allowNull: false, 
      validate: {
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("Le champ Établissement doit être une chaîne de caractères.");
          }},
        notEmpty: {
          msg: "Le champ Établissement est obligatoire."
        },},},
    // Role (e.g. doctor, nurse, physiotherapist)
    role: { type: DataTypes.STRING, allowNull: false, 
      validate: {
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("Le champ Rôle doit être une chaîne de caractères.");
          }},
        notEmpty: {
          msg: "Le champ Rôle est obligatoire."
        },},},
    // Medical or paramedical specialty
    speciality: { type: DataTypes.STRING, allowNull: false, 
      validate: {
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("Le champ Spécialité doit être une chaîne de caractères.");
          }},
        notEmpty: {
          msg: "Le champ Spécialité est obligatoire."
        },},
    },
  },
  {
    sequelize, // Connect to the database
    modelName: "Pro", // Internal name of the Sequelize model
    tableName: "pros", // Table name in the database
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
