/**
* Routes for Users
*
* This file defines the Express endpoints for managing users.
* It uses the `UserController` to execute business logic
* and the `authenticate` middleware to secure protected routes.
*
* Available routes:
* - GET /email/:email → Retrieve a user by their email address (authenticated)
* - POST /login → Authenticate and generate a JWT token
*/
import express from 'express';
import UserController from '../controllers/userContoller.js';
import authenticate from '../middleware/authMiddleware.js';

// Creating an Express router
const router = express.Router();

// Retrieves a user by email
// Protected route: requires a valid JWT token
router.get('/email/:email', authenticate, UserController.getByEmail);

// Authenticates a user (login) and returns a JWT token
// This route is not protected because it is the entry point for authentication
router.post('/login', UserController.login);

export default router;