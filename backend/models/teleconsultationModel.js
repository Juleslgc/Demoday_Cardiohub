import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import BaseModel, { baseModel } from "./baseModel.js";
import Appointment from "./appointmentModel.js";

export default class Teleconsultation extends BaseModel{}

Teleconsultation.init(
  {
    ...baseModel,
    appointmentId: { type: DataTypes.UUID, allowNull: false, references: { model: Appointment, key: "id" }, onDelete: "CASCADE" },
    jitsiLink: { type: DataTypes.STRING(100), allowNull: false },
    status: { type: DataTypes.ENUM("scheduled", "in_progress", "completed", "cancelled"), defaultValue: "scheduled", allowNull: false },
  },
  {
    sequelize,
    modelName: "Teleconsultation",
    tableName: "teleconsultations",
    timestamps: true,
  }
);
