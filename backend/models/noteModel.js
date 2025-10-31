import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import BaseModel, { baseModel } from "./baseModel.js";
import Appointment from "./appointmentModel.js";
/**
* -------------------------------------------------------------------------
* noteModel.js
*
* -------------------------------------------------------------------------
* File purpose:
* This file defines the **Sequelize `Note` model**, representing a **medical note**
* associated with an appointment (`Appointment`). 
*
* A note is a comment or report that the professional can enter
* following a teleconsultation or appointment. 
*/

export default class Note extends BaseModel{}

Note.init(
  {
    ...baseModel, // Fields inherited from BaseModel
    description: { type: DataTypes.STRING(250), allowNull: false }, // Text content of the medical note
    appointmentId: { type: DataTypes.UUID, allowNull: false, references: { model: Appointment, key: "id" }, onDelete: "CASCADE" }, // Reference to the associated appointment
  },
  {
    sequelize, // Connecting to the database
    modelName: "Note", // Model name for Sequelize
    tableName: "notes", // Table name in the database
    timestamps: true, // Active createdAt / updatedAt
  }
);
