/**
* 
* ----------------------------------------------------------------------------
* authMiddleware.js
*
* ----------------------------------------------------------------------------
* JWT authentication middleware for Express.
*
* Its role:
* - Verifies that a valid JWT token is present in the request's `Authorization` header.
* - Decodes this token to identify the user (stored in `req.user`).
* - Rejects the request with a 401 error if the token is missing or invalid.
*
* Usage:
* To be placed on protected routes:
*
* How it works:
* 1. Checks for the presence of the "Authorization" header (format: "Bearer <token>").
* 2. Extracts the token and verifies it with the secret key defined in `.env`.
* 3. If valid, adds the user information to `req.user` and passes the processing to the next middleware.
* 4. Otherwise, returns an HTTP 401 (Unauthorized) error.
*/
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Load the .env file (with a relative path to the parent directory)
dotenv.config({ path: "../.env" });

// Retrieve the secret key used to sign JWT tokens
const SECRET_KEY = process.env.JWT_SECRET;

// Authentication middleware
export default function authenticate(req, res, next) {
  // Retrieves the "Authorization" header sent by the client
  const authHeader = req.headers.authorization;

  // Checks if a token is present in the request
  if (!authHeader) {
    return res.status(401).json({ message: "Aucun jeton n'a été fourni" });
  }

  // The header must be in the format "Bearer <token>"
  const token = authHeader.split(" ")[1]; // "Bearer <token>"

  try {
    // Verifies and decodes the token with the secret key
    const decoded = jwt.verify(token, SECRET_KEY);
    // Stores user information in the `req` object
    // (then accessible in protected routes)
    req.user = decoded;
    // Move to the next middleware or controller
    next();
  } catch (err) {
    // If the token is invalid, expired or malformed -> error 401
    return res.status(401).json({ message: "Jeton invalide" });
  }
}
