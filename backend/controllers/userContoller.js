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

			// The service handles validation + bcrypt + token generation
			const { user, token } = await userService.login(email, password);

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