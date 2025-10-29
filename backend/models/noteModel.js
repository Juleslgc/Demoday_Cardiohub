import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import BaseModel, { baseModel } from "./baseModel.js";
import Appointment from "./appointmentModel.js";

export default class Note extends BaseModel{}

Note.init(
  {
    ...baseModel,
    description: { type: DataTypes.STRING(250), allowNull: false },
    appointmentId: { type: DataTypes.UUID, allowNull: false, references: { model: Appointment, key: "id" }, onDelete: "CASCADE" },
  },
  {
    sequelize,
    modelName: "Note",
    tableName: "notes",
    timestamps: true,
  }
);