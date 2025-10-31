/**
* -------------------------------------------------------------------------
* baseModel.js
*
* -------------------------------------------------------------------------
* This file defines a base model (`BaseModel`) used as the parent class
* for all Sequelize models in the application.
*
* Purpose:
* - Centralize fields and behaviors common to multiple models.
* - Avoid code duplication (e.g., for `id`, `createdAt` fields, etc.).
*
* Structure:
* 1. `BaseModel` → an empty class that inherits from `Sequelize.Model`, serving as a common base.
* 2. `baseModel` → an object containing standard fields to be reused in other models.
*
*
* Advantage: consistency and simplification when creating new models.
*/
import { Model, DataTypes } from "sequelize";

// Definition of a BaseModel class that inherits from Model
// All models in the database can inherit from BaseModel to share common fields
export default class BaseModel extends Model {}

// Definition of a baseModel object containing common fields
export const baseModel = {
  id: {
    type: DataTypes.UUID, // Uses a universally unique identifier (UUID)
    defaultValue: DataTypes.UUIDV4, // Automatically generates a v4 UUID on creation
    primaryKey: true, // Set this field as the primary key
  },
};
