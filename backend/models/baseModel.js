import { Model, DataTypes } from 'sequelize';

// Definition of a BaseModel class that inherits from Model
// All models in the database can inherit from BaseModel to share common fields
export default class BaseModel extends Model {}

// Definition of a baseModel object containing common fields
export const baseModel = {
  id: {
		type: DataTypes.UUID,
		defaultValue: DataTypes.UUIDV4,
		primaryKey: true,
	},
};