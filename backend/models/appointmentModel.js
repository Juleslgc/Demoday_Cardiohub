import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import BaseModel, { baseModel } from "./baseModel.js";

/**
* -------------------------------------------------------------------------
* apppointmentModel.js

* -------------------------------------------------------------------------
* File purpose:
* This file defines the **Sequelize model** representing an **appointment**
* in the database. 
*
* The model serves as a "structural blueprint" for the `appointments` table:
*   - It defines the **columns**, their **data types**,
*     and their **constraints** (required, default value, etc.). 
*   - It inherits from `BaseModel` to include common generic fields
*     (such as `id`, `createdAt`, `updatedAt`, etc.). 
*/

export default class Appointment extends BaseModel {}

Appointment.init(
  {
    ...baseModel, // Fields inherited from BaseModel
    dateTime: { type: DataTypes.DATE, allowNull: false }, // Date and time of the appointment
    duration: { type: DataTypes.INTEGER, allowNull: false }, // Duration of the appointment (in minutes)
    status: { type: DataTypes.STRING, allowNull: false, defaultValue: "À venir" }, // Appointment status
  },
  {
    sequelize, // Connecting to the database
    modelName: "Appointment", // Logical name of the model
    tableName: "appointments", // Table name
    timestamps: true, // Add createdAt / updatedAt
  }
);