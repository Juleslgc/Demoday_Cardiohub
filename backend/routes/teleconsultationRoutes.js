import { Router } from "express";
import authenticate from "../middleware/authMiddleware.js";
import teleconsultationController from "../controllers/teleconsultationController.js";
/**
* -------------------------------------------------------------------------
* teleconsultationRoute.js
*
* -------------------------------------------------------------------------
* This file manages all routes related to teleconsultations in the backend application. 
*
* Each route delegates the business logic to the `TeleconsultationController` for actions
* such as creating a teleconsultation or securely retrieving an existing teleconsultation. 
*
* All routes are protected by the `authenticate` middleware, ensuring that
* only authenticated requests can access or modify the data. 
*
* The controller handles validation, service calls, and responses. 
*/

const router = Router();

// Route to creating a new teleconsultation (accessible only to professionals)
router.post("/:appointmentId", authenticate, teleconsultationController.createTeleconsultation);

// Route to retrieves a teleconsultation (accessible to the corresponding patient or professional)
router.get("/:appointmentId", authenticate, teleconsultationController.getByAppointment);

export default router;
