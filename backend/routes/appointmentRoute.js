import express from "express";
import AppointmentController from "../controllers/appointmentController.js";
import authenticate from "../middleware/authMiddleware.js";
/**
* -------------------------------------------------------------------------
* appointmentRoute.js
*
* -------------------------------------------------------------------------
* This file handles all HTTP operations related to appointments
* in the backend application. 
*
* Each route delegates the business logic to the `AppointmentController` and uses
* the `authenticate` middleware to secure access. This ensures that
* only authenticated users can create, view, modify,
* or cancel appointments. 
*
* All routes are protected by the authentication middleware. 
*/

const router = express.Router();
// Route for creating a new appointment
router.post("/", authenticate, AppointmentController.createAppointment);

// Route to retrieve all appointments for a professional
router.get("/pro/:proId", authenticate, AppointmentController.getAppointments);

// Route to retrieve all appointments for a patient
router.get("/patient/:patientId", authenticate, AppointmentController.getAppointments);

// Route to update the details of an appointment
router.put("/:id", authenticate, AppointmentController.updateAppointment);

// Route for canceling an appointment
router.put("/cancel/:id", authenticate, AppointmentController.cancelAppointment);

// Route to update the status of an appointment (Upcoming, Completed, Cancelled)
router.put("/status/:id", authenticate, AppointmentController.updateStatus);

export default router;