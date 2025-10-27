/**
* Routes for Healthcare Professionals (Pro)
*
* This file defines the Express endpoints for managing professionals and their patients.
* It uses the `ProController` to execute business logic
* and the `authenticate` middleware to secure protected routes.
* Available routes:
* - POST /register/pro/ -> Create or retrieve a pro
* - GET /pro/ -> Retrieve all pros
* - GET /pro/:rpps -> Retrieve a pro by RPPS
* - PUT /pro/:id -> Update a pro by id
* - DELETE /pro/:id -> Delete a pro by id
* - GET /pro/:proId/patients -> Retrieve all patients of a pro
* - GET /pro/:proId/patients/:patientId -> Retrieve a specific patient of a pro
*/
import express from 'express';
import ProController from '../controllers/proController.js';
import authenticate from '../middleware/authMiddleware.js';

// Creating an Express router
const router = express.Router();

// Create or retrieve a pro
router.post('/auth/register/pro/', ProController.createOrLoginPro);

// Recover all Pro
router.get('/pro/', authenticate, ProController.getAllPros);

// Recover a pro by RPPS
router.get('/pro/:rpps', authenticate, ProController.getProByRpps);

// Update a pro by id
router.put('/pro/:id', authenticate, ProController.updatePro);

// Delete a pro by id
router.delete('/pro/:id', authenticate, ProController.deletePro);

// Ajoute patient
router.post("/add/pro/:proId/patients/:patientId", authenticate, ProController.addPatient);

// Retrieve all patients from a pro
router.get('/pro/:proId/patients',  ProController.getAllPatients);

// Retrieve a specific patient from a pro
router.get('/pro/:proId/patients/:patientId', authenticate, ProController.getPatient);

// Rechercher un patient par son nom
router.get("/:proId/patients", ProController.searchPatients);

// Rechercher tout les patients
router.get("/patients/all", ProController.searchAllPatients);


export default router;