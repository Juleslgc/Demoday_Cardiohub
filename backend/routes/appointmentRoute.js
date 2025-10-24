import express from 'express';
import AppointmentController from '../controllers/appointmentController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/", authenticate, AppointmentController.createAppointment);

router.get("/pro/:proId", authenticate, AppointmentController.getAppointments);

router.get("/patient/:patientId", authenticate, AppointmentController.getAppointments);

router.put("/:id", authenticate, AppointmentController.updateAppointment);

router.put("/cancel/:id", authenticate, AppointmentController.cancelAppointment);

router.put("/status/:id", authenticate, AppointmentController.updateStatus);

export default router;