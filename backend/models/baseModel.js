/**
 * BaseModel definition for Sequelize models.
 *
 * - Provides a reusable base class (`BaseModel`) extending Sequelize's `Model`.
 * - Exports a `baseModel` object containing common fields (e.g., `id` as UUID).
 * - Other models in the project can inherit from this base setup to ensure consistency.
 *
 * Notes:
 * - Using UUID as the primary key ensures uniqueness across distributed systems.
 * - Additional common fields (e.g., timestamps, createdBy, updatedBy) can be added here.
 */

import { Model, DataTypes } from 'sequelize';

// BaseModel class that can be extended by all models in the database
export default class BaseModel extends Model {}

// Common fields shared by multiple models
export const baseModel = {
  id: {
        type: DataTypes.UUID,            // Universally unique identifier
        defaultValue: DataTypes.UUIDV4,  // Auto-generate a UUID v4 when a record is created
        primaryKey: true,                // Defines 'id' as the primary key for the table
    },
};
