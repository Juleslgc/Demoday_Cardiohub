import { Router } from "express";
import patientController from "../controllers/patientController.js";
import authenticate from "../middleware/authMiddleware.js";
/**
 * -------------------------------------------------------------------------
 * patientRoute.js
 *
 * -------------------------------------------------------------------------
 * - Defines REST API routes related to patients.
 * - Connects routes to PatientController methods.
 * - Secures sensitive routes with the JWT authentication middleware.
 *
 * Notes:
 * - `authenticate` middleware ensures only authenticated users can access protected routes.
 * - Controllers handle validation, service calls, and responses.
 */

const router = Router();

// Route to register a new patient (public route)
router.post("/register/patient", patientController.registerPatient);

// Route to get a patient by ID (protected route)
router.get("/patient/:id", authenticate, patientController.getById);

// Route to update a patient's data (protected route)
router.put("/patient/:id", authenticate, patientController.updatePatient);

// Route to delete a patient (protected route)
router.delete("/patient/:id", authenticate, patientController.deletePatient);

// Authenticates a user (login) and returns a JWT token
// This route is not protected because it is the entry point for authentication
router.post("/login", patientController.login);

// Retrieves a user by email
// Protected route: requires a valid JWT token
router.get("/email/:email", authenticate, patientController.getByEmail);

export default router;
