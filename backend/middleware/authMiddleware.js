/**
 * Authentication middleware using JWT.
 *
 * - Extracts the token from the "Authorization" header.
 * - Verifies the token using the secret stored in environment variables.
 * - Attaches the decoded payload to req.user if valid.
 * - Blocks the request with 401 Unauthorized if no token, or if the token is invalid/expired.
 *
 * Notes:
 * - Expected header format: "Authorization: Bearer <token>"
 * - Make sure process.env.JWT_SECRET is defined.
 */

import jwt from "jsonwebtoken";

export default function authenticate(req, res, next) {
	const authHeader = req.headers.authorization;

	// Reject requests without an Authorization header
	if (!authHeader) {
			return res.status(401).json({ message: "No token provided" });
	}

	// Extract the token (expected format: "Bearer <token>")
	const token = authHeader.split(" ")[1];

	try {
		// Verify the token and decode its payload
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Attach decoded payload (e.g., user ID, roles) to the request object
		req.user = decoded;

		// Pass control to the next middleware or route handler
		next();
	} catch (err) {
		// Token is missing, invalid or expired
			return res.status(401).json({ message: "Invalid or expired token" });
	}
}
