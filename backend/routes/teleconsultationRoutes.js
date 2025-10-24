/**
 * Handles API endpoints related to teleconsultations:
 *  - Creation of a teleconsultation by a professional
 *  - Secure retrieval of a teleconsultation (for authorized users)
 *
 * Notes:
 * - All routes are protected by authentication middleware.
 * - Routes delegate business logic to the TeleconsultationController.
 */

import { Router } from "express";
import authenticate from "../middleware/authMiddleware.js";
import teleconsultationController from "../controllers/teleconsultationController.js";

const router = Router();

// Creates a new teleconsultation (accessible only to professionals)
router.post("/:appointmentId", authenticate, teleconsultationController.createTeleconsultation);

// Retrieves a teleconsultation (accessible to the corresponding patient or professional)
router.get("/:appointmentId", authenticate, teleconsultationController.getByAppointment);

export default router;
