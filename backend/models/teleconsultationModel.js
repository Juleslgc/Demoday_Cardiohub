/**
 * This model defines the "Teleconsultation" entity in the database.
 * It extends the BaseModel class and uses Sequelize ORM for database interaction.
 *
 * Responsibilities:
 * - Represents teleconsultation records linked to appointments
 * - Defines schema fields, types, and database relationships
 *
 * Notes:
 * - Each teleconsultation is associated with an appointment (via foreign key `appointmentId`)
 * - Automatically includes common base fields from the BaseModel (e.g., id, createdAt, updatedAt)
 */

import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import BaseModel, { baseModel } from "./baseModel.js";
import Appointment from "./appointmentModel.js";

export default class Teleconsultation extends BaseModel{}

Teleconsultation.init(
  {
    ...baseModel,
    appointmentId: { type: DataTypes.UUID, allowNull: false, references: { model: Appointment, key: "id" }, onDelete: "CASCADE" },
    
    // Field storing the Jitsi meeting link used for the teleconsultation session
    jitsiLink: { type: DataTypes.STRING(100), allowNull: false },
  },
  {
    sequelize,
    modelName: "Teleconsultation",
    tableName: "teleconsultations",
    timestamps: true,
  }
);
