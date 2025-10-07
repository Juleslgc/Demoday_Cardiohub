/**
* Specific repository: UserRepository
*
* This repository manages interactions with user data.
* It inherits from BaseRepository to benefit from generic CRUD methods:
* - create, findById, findAll, findOne, update, delete
*
* Specific methods:
* - findByEmail(email) → searches for a user by email address.
*/
import BaseRepository from './baseRepository.js';
import User from '../models/userModel.js';
import { fn, col } from "sequelize";
import { sequelize } from "../config/db.js";

export default class UserRepository extends BaseRepository {
  constructor() {
		super(User);
	}

	// Search for a user by email, case and space insensitive
  async findByEmail(email) {
    return await this.model.findOne({
      where: sequelize.where(
        fn('LOWER', col('email')),    // converts the column to lowercase
        email.toLowerCase().trim()    // converts the input to lowercase and removes spaces
      )
    });
  }
}
