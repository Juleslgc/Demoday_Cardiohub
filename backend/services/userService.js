import { UserRepository } from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Create an instance of the repository to access user-related methods
const userRepository = new UserRepository();

export default class UserService {

	// Method to retrieve a user by email
	async getByEmail(email) {
		if (!email) {
			throw new Error('Missing data');
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw new Error('Invalid email format');
		}

		const user = await userRepository.findByEmail(email);
		if (!user) {
			throw new Error('Email not found');
		}

		return user;
	}

	 async login(email, password) {
    const user = await userRepository.getByEmail(email);

    // Verify the password
		const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }

    // Generates a JWT
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '3h' }
    );

    return { user, token };
  }
}