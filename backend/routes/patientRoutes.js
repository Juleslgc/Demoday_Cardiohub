/**
 * Patient routes definition.
 *
 * - Defines REST API routes related to patients.
 * - Connects routes to PatientController methods.
 * - Secures sensitive routes with the JWT authentication middleware.
 *
 * Routes:
 * - POST   /register/patient  → Register a new patient (public)
 * - GET    /patient/:id       → Get a patient by ID (protected)
 * - PUT    /patient/:id       → Update patient details (protected)
 * - DELETE /patient/:id       → Delete a patient (protected)
 *
 * Notes:
 * - `authenticate` middleware ensures only authenticated users can access protected routes.
 * - Controllers handle validation, service calls, and responses.
 */

import { Router } from "express";
import patientController from "../controllers/patientController.js";
import authenticate from "../middleware/authMiddleware.js";

const router = Router();

// Register a new patient (public route)
router.post("/register/patient", patientController.registerPatient);

// Get a patient by ID (protected route)
router.get("/patient/:id", authenticate, patientController.getById);

// Update a patient's data (protected route)
router.put("/patient/:id", authenticate, patientController.updatePatient);

// Delete a patient (protected route)
router.delete("/patient/:id", authenticate, patientController.deletePatient);

// Authenticates a user (login) and returns a JWT token
// This route is not protected because it is the entry point for authentication
router.post('/login', patientController.login);

// Retrieves a user by email
// Protected route: requires a valid JWT token
router.get('/email/:email', authenticate, patientController.getByEmail);

// Returns patient information based on JWT token
router.get("/me", authenticate, patientController.getMe);

export default router;