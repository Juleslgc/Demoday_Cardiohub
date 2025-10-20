import express from 'express';
import AppointmentController from '../controllers/appointmentController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/", AppointmentController.createAppointment);

router.get("/pro/:proId", AppointmentController.getAppointments);

router.get("/patient/:patientId", AppointmentController.getAppointments);

router.put("/:id", AppointmentController.updateAppointment);

router.put("/cancel/:id", AppointmentController.cancelAppointment);

router.put("/status/:id", AppointmentController.updateStatus);

export default router;