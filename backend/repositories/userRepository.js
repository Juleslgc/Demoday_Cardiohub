import { BaseRepository } from './baseRepository.js';
import { User } from '../models/userModel.js';

export default class UserRepository extends BaseRepository {
  constructor() {
		super(User);
	}

	// We define an asynchronous method "findByEmail"
	// which allows us to find a user in the database
	// based on their email address.
	async findByEmail(email) {
		return await this.findOne({ where: { email } });
	}
}
