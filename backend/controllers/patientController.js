/**
 * This controller handles HTTP requests related to patients.
 * It delegates business logic to the patientService and returns appropriate HTTP responses.
 *
 * Responsibilities:
 * - Register a new patient
 * - Retrieve a patient by ID
 * - Update patient details
 * - Delete a patient
 *
 * Notes:
 * - Each method is wrapped in try/catch to handle service errors.
 * - Returns JSON responses with appropriate HTTP status codes.
 */

import { ValidationError } from "sequelize";
import patientService from "../services/patientService.js";

class PatientController {
	// Register a new patient
	async registerPatient(req, res) {
		try {
			const result = await patientService.registerPatient(req.body); // Delegates to the service layer
			res.status(201).json(result);	// Responds with "Created" status
		} catch (err) {
			if (err instanceof ValidationError) {
				return res.status(400).json({ error: err.errors[0].message });
			}
			res.status(400).json({ error: err.message }); // Bad Request (invalid input, validation error, etc.)
		}
	}

	// Retrieve a patient by ID
	async getById(req, res) {
		try {
			const patient = await patientService.getPatientById(req.params.id); // Looks up patient by ID
			res.status(200).json(patient); // Responds with the found patient
		} catch (err) {
			res.status(404).json({ error: err.message }); // Not Found (invalid or unknown ID)
		}
	}

	// Update an existing patient
	async updatePatient(req, res) {
		try {
			const updated = await patientService.updatePatient(req.params.id, req.body); // Delegates update logic
			res.status(200).json(updated); // OK, returns updated record
		} catch (err) {
			res.status(400).json({ error: err.message }); // Bad Request (validation or update error)
		}
	}

	// Delete a patient by ID
	async deletePatient(req, res) {
		try {
			const result = await patientService.deletePatient(req.params.id); // Delegates deletion logic
			res.status(200).json(result); // OK, confirms deletion
		} catch (err) {
			res.status(404).json({ error: err.message }); // Not found (patient does not exist)
		}
	}
}

export default new PatientController();
