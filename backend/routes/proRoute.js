import express from "express";
import ProController from "../controllers/proController.js";
import authenticate from "../middleware/authMiddleware.js";
/**
* -------------------------------------------------------------------------
* proRoute.js
*
* -------------------------------------------------------------------------
* This file manages all routes related to healthcare professionals (Pros)
* in the backend application. 
*
* Each route delegates the business logic to the `ProController` for actions
* such as creation, retrieval, update, deletion, and management of associated patients. 
*
* Some routes use the `authenticate` middleware to secure access,
* ensuring that only authenticated requests can access or modify the data. 
*
* The controller handles validation, service calls, and responses. 
*/

// Creating an Express router
const router = express.Router();

// Route for creating or retrieve a pro
router.post("/auth/register/pro/", ProController.createOrLoginPro);

// Route to recover all Pro
router.get("/pro/", authenticate, ProController.getAllPros);

// Route to recover a pro by RPPS
router.get("/pro/:rpps", authenticate, ProController.getProByRpps);

// Route to update a pro by id
router.put("/pro/:id", authenticate, ProController.updatePro);

// Route to delete a pro by id
router.delete("/pro/:id", authenticate, ProController.deletePro);

// Route to add a patient to a pro
router.post("/add/pro/:proId/patients/:patientId", authenticate, ProController.addPatient);

// Route to retrieve all patients from a pro
router.get("/pro/:proId/patients",  ProController.getAllPatients);

// Route to retrieve a specific patient from a pro
router.get("/pro/:proId/patients/:patientId", authenticate, ProController.getPatient);

// Route to search for a patient by name for a pro
router.get("/:proId/patients", ProController.searchPatients);

// Route to search for all patients
router.get("/patients/all", ProController.searchAllPatients);

export default router;