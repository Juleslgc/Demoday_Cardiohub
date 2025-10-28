import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import BaseModel, { baseModel } from "./baseModel.js";
import Teleconsultation from "./teleconsultationModel.js";

export default class Note extends BaseModel{}

Note.init(
  {
    ...baseModel,
    description: { type: DataTypes.STRING(250), allowNull: false },
  },
  {
    sequelize,
    modelName: "Note",
    tableName: "Notes",
    timestamps: true,
  }
);