import express from 'express';
import ProController from '../controllers/proController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

// Create or retrieve a pro
router.post('/', ProController.createPro);

// Recover all Pro
router.get('/', authenticate, ProController.getAllPros);

// Recover a pro by RPPS
router.get('/:rpps', authenticate, ProController.getProByRpps);

// Update a pro by id
router.put('/:id', authenticate, ProController.updatePro);

// Delete a pro by id
router.delete('/:id', authenticate, ProController.deletePro);

// Retrieve all patients from a pro
router.get('/:proId/patients', authenticate, ProController.getAllPatients);

// Retrieve a specific patient from a pro
router.get('/:proId/patients/:patientId', authenticate, ProController.getPatient);

export default router;
