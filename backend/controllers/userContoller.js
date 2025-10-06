/**
* This file defines the `UserController` controller, responsible for managing
* users (authentication and account retrieval).
*
* Role:
* - Communicate between routes (Express) and the service layer (`UserService`).
* - Handle requests related to login and user search.
* - Generate a JWT token upon login for authentication.
*
* Technologies used:
* - bcrypt -> to securely compare passwords.
* - jsonwebtoken -> to generate a signed access token (JWT).
*
* Structure:
* 1. getByEmail() -> Retrieves a user by email.
* 2. login() -> Authenticates a user and generates a JWT token.
*/
import UserService from '../services/userService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Create an instance of the user service
const userService = new UserService;

export default class UserController {
  
	// Retrieves a user based on their email address.
	static async getByEmail(req, res) {
		const { email } = req.params; // Retrieves the email passed in the URL
		try {
			const user = await userService.getByEmail(email); // Call the service to search for the user
			// If the user does not exist -> code 404
			if (!user) {
				return res.status(404).json({ message: 'Utilisateur n\'existe pas'});
			}
			// If found -> returns user info
			return res.status(200).json(user);
		} catch (err) {
			// In case of technical error -> code 400
			return res.status(400).json({ message: err.message });
		}
	}

	// Authenticates a user (login) and generates a JWT token.
	static async login(req, res) {
		try {
			// We retrieve the identifiers from the body of the request
			const { email, password } = req.body;

			// Checks if a user exists with this email
			const user = await userService.getByEmail(email);
			if (!user) {
				return res.status(404).json({message: 'Utilisateur non trouvé'});
			}

			// Compare the received password with the hash stored in the database
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
			// If the password is incorrect -> code 401 (Unauthorized)
				return res.status(401).json({ message: 'Mot de passe invalide'});
			}

			// Creation of the JWT token for the authenticated user
			// This token will allow access to protected roads for 3 hours.
			const token = jwt.sign(
				{ id: user.id, email: user.email }, // Data embedded in the token
				SECRET_KEY, // Secret signing key (which is defined in .env)
				{ expiresIn: '3h' } // Token validity period
			);

      // Remove the password before returning the user
			const { password: _, ...userWithoutPassword } = user;

				// Returns a complete response: message, user and token
        return res.status(200).json({
        message: 'Connexion réussie',
        user: userWithoutPassword,
        token,
      });
		} catch (err) {
			// In case of error (non-existent email, token problem, etc.)
			return res.status(400).json({ message: err.message });
		}
	}
}