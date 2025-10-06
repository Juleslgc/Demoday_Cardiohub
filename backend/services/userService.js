/**
* Business Service: UserService
*
* This service contains the business logic for managing users.
* It uses UserRepository to interact with the database.
*
* Main roles:
* - Retrieve a user by email
* - Authenticate a user (login) and generate a JWT token
*
* The service focuses on data validation, authentication logic
* and JWT generation, while the repository only handles CRUD access.
*/
import UserRepository from '../repositories/userRepository.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

// Create an instance of the repository to access user-related methods
const userRepository = new UserRepository();

export default class UserService {

	// Method to retrieve a user by email
	async getByEmail(email) {
		if (!email) {
			throw new Error('Email manquant');
		}
		// Validation of the email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw new Error('Format email non valide');
		}
		// Search for the user in the database
		const user = await userRepository.findByEmail(email);
		if (!user) {
			throw new Error('Email introuvable');
		}

		return user;
	}

	// Authenticates a user and generates a JWT token
	async login(email, password) {
    if (!email || !password) {
      throw new Error('Email et mot de passe requis');
    }
		// Search for the user in the database
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
		// Password verification with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Mot de passe invalide');
    }

		// Generation of a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '3h' } // Token validity period
    );
		// Returns the user and token
    return { user, token };
  }
}