import express from 'express';
import noteController from '../controllers/noteController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/appointment/:appointmentId", authenticate, noteController.createNote);

router.get("/appointment/:appointmentId", authenticate, noteController.getNoteByAppointment);

router.put("/:id", authenticate, noteController.updateNote);

export default router;