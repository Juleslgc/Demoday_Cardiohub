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
import { Patient } from "../models/relationModel.js";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;


class PatientService {
	// Register a new patient
	async registerPatient(data) {
    const hasUsefulData = data && Object.entries(data).some(
    ([key, value]) => key !== 'role' && value != null && value !== '');

    if (!hasUsefulData) {
      throw new Error('Aucune information fournie dans le formulaire.');
    }
    if (!data.lastName) {
      throw new Error('Le nom est obligatoire.');
    }
		// Valiidation nom et prénom
		if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(data.lastName)) {
    	throw new Error('Le nom doit contenir uniquement des lettres.');
  		}
    if (!data.firstName) {
      throw new Error('Le prénom est obligatoire.');
    }
		if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(data.firstName)) {
    	throw new Error('Le prénom doit contenir uniquement des lettres.');
  		}
    // Phone validation: exactly 10 digits
    if(data.phone) {
      if (!/^\d{10}$/.test(data.phone)) {
    	throw new Error('Le numéro de téléphone doit comporter exactement 10 chiffres.');
  		}
    }
		
		// Check if the email already exists
		const existingEmail = await patientRepository.findByEmail(data.email);
		if (existingEmail) {
			throw new Error("Email déjà utilisé");
		}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(data.email)) {
			throw new Error('Format email non valide');
		}

    // Validation birthDate
    if (!data.birthDate) {
      throw new Error("La date de naissance est obligatoire.");
    }

    const birthDate = new Date(data.birthDate);
    if (isNaN(birthDate.getTime())) {
      throw new Error("Format de date de naissance invalide.");
    }

    const year = birthDate.getFullYear();
    const today = new Date();

    if (birthDate > today) {
      throw new Error("La date de naissance ne peut pas être dans le futur.");
    }

    if (year < 1930) {
      throw new Error("La date de naissance est inférieur à 1930.");
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

  // Method to retrieve a user by email
	async getByEmail(email) {
		if (!email) {
			throw new Error('Email manquant');
		}
		// Validation of the email format
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			throw new Error('Format email non valide');
		}
		// Search for the user in the database
		const user = await patientRepository.findByEmail(email);
		if (!user) {
			throw new Error('Email introuvable');
		}

		return user;
	}

	// Authenticates a user and generates a JWT token
	async login(email, password) {
    if (!email || !password) {
      throw new Error('Email et mot de passe requis');
    }
		// Search for the user in the database
    const user = await Patient.scope("withPassword").findOne({ where: { email } });
    console.log(user);
    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }
		// Password verification with bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Mot de passe invalide');
    }

		// Generation of a JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      SECRET_KEY,
      { expiresIn: '3h' } // Token validity period
    );
		// Returns the user and token
    return { user, token };
  }
}

export default new PatientService();
