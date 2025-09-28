import express from 'express';
import ProController from '../controllers/proController.js';
import authenticate from '../middleware/authMiddleware.js';

const router = express.Router();

// Create or retrieve a pro
router.post('/', ProController.createPro);

// Recover a pro by RPPS
router.get('/:rpps', ProController.getProByRpps);

// Update a pro by id
router.put('/:id', ProController.updatePro);

// Delete a pro by id
router.delete('/:id', ProController.deletePro);

// Retrieve all patients from a pro
router.get('/:proId/patients', ProController.getAllPatients);

// Retrieve a specific patient from a pro
router.get('/:proId/patients/:patientId', ProController.getPatient);

export default router;
