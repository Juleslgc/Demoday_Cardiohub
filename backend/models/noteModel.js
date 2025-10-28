import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";
import BaseModel, { baseModel } from "./baseModel";
import Teleconsultation from "./teleconsultationModel";

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