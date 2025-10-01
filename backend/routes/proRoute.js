import express from 'express';
import ProController from '../controllers/proController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

// Create or retrieve a pro
router.post('/register/pro/', ProController.createOrLoginPro);

// Recover all Pro
router.get('/pro/', authenticate, ProController.getAllPros);

// Recover a pro by RPPS
router.get('/pro/:rpps', authenticate, ProController.getProByRpps);

// Update a pro by id
router.put('/pro/:id', authenticate, ProController.updatePro);

// Delete a pro by id
router.delete('/pro/:id', authenticate, ProController.deletePro);

// Retrieve all patients from a pro
router.get('/pro/:proId/patients', authenticate, ProController.getAllPatients);

// Retrieve a specific patient from a pro
router.get('/pro/:proId/patients/:patientId', authenticate, ProController.getPatient);

export default router;
