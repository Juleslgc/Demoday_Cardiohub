/**
 * PatientService
 *
 * - Handles business logic related to patients.
 * - Delegates database operations to PatientRepository.
 * - Ensures security by hashing passwords before saving them.
 *
 * Responsibilities:
 * - Register new patients (with unique email validation and password hashing).
 * - Retrieve a patient by ID.
 * - Update patient data (rehash password if updated).
 * - Delete patients.
 *
 * Notes:
 * - Password hashing uses bcrypt with cost factor 10 (can be increased for stronger security).
 * - Throws errors when operations fail (e.g., email already in use, patient not found).
 */

import bcrypt from "bcrypt";
import patientRepository from "../repositories/patientRepository.js";

class PatientService {
	// Register a new patient
	async registerPatient(data) {
		// Check if the email already exists
		const existingEmail = await patientRepository.findByEmail(data.email);
		if (existingEmail) {
			throw new Error("Email déjà utilisé");
		}

		// Hash the password (cost factor = 10 by default)
    // For healthcare apps, consider increasing to 12–14 if the infrastructure can support it
		const hashedPassword = await bcrypt.hash(data.password, 10);

		// Create the patient in the database
		const patient = await patientRepository.create({
			...data,
			password: hashedPassword,
		});

		return {
			message: "Votre compte a été créé avec succès !",
			userId: patient.id,
		};
	}

	// Retrieve a patient by ID
	async getPatientById(id) {
		const patient = await patientRepository.findById(id);
		if (!patient) {
			throw new Error("Patient introuvable");
		}
		return patient;
	}

	// Update an existing patient
	async updatePatient(id, data) {
		// If password is provided, hash it before saving
		if (data.password) {
			data.password = await bcrypt.hash(data.password, 10);
		}

		const updated = await patientRepository.update(id, data);
		if (!updated) {
			throw new Error("Patient introuvable ou non modifié");
		}
		return updated;
	}

	// Delete a patient
	async deletePatient(id) {
		const deleted = await patientRepository.delete(id);
		if (!deleted) {
			throw new Error("Patient introuvable");
		}
		return { message: "Patient supprimé avec succès"};
	}
}

export default new PatientService();
