import express from "express";
import noteController from "../controllers/noteController.js";
import authenticate from "../middleware/authMiddleware.js";
/**
* -------------------------------------------------------------------------
* noteRoute.js
*
* -------------------------------------------------------------------------
* This file handles all HTTP operations related to notes associated with
* appointments in the backend application. 
*
* Each route delegates the business logic to the `noteController` and uses
* the `authenticate` middleware to secure access. This ensures that
* only authenticated users can create, view, or modify
* notes related to appointments. 
*
* All routes are protected by the authentication middleware. 
*/

const router = express.Router();
// Route for creating a note for an appointment
router.post("/appointment/:appointmentId", authenticate, noteController.createNote);

// Route to retrieve the note associated with an appointment
router.get("/appointment/:appointmentId", authenticate, noteController.getNoteByAppointment);

// Route to update an existing note
router.put("/:id", authenticate, noteController.updateNote);

export default router;