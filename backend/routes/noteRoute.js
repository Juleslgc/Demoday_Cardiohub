import express from 'express';
import noteController from '../controllers/noteController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/appointment/:appointmentId", noteController.createNote);

router.get("/appointment/:appointmentId", noteController.getNoteByAppointment);

router.put("/:id", noteController.updateNote);

export default router;