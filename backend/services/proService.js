/**
* Business Service: ProService
*
* This service contains the business logic for managing healthcare professionals (Pros)
* and their patients. It uses ProRepository to interact with the database.
*
* Main roles:
* - Creating or logging in to a Pro
* - Retrieving all Pros or a specific Pro
* - Managing patients associated with a Pro
* - Updating and deleting Pros
* - Validating business data
*
* The service focuses on business logic, validation, and JWT generation,
* while the repository only manages CRUD access to the database.
*/
import proRepository from '../repositories/proRepository.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Patient } from '../models/relationModel.js';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;

export default class ProService {

	// Creates a new Pro or returns the existing Pro
	async createOrLoginPro(data) {
		// Verification of received data
		const hasUsefulData = data && Object.entries(data).some(
    ([key, value]) => key !== 'role' && value != null && value !== '');

  if (!hasUsefulData) {
    throw new Error('Aucune information fournie dans le formulaire.');
  }
		// RPPS validation: exactly 11 digits
		if (!/^\d{11}$/.test(data.rpps)) {
    	throw new Error('Le numéro RPPS doit comporter exactement 11 chiffres.');
  		}
		// Validation of text fields: only letters and special characters allowed
		if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(data.firstName)) {
  			throw new Error('Le prénom doit contenir uniquement des lettres.');
		}
		if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(data.lastName)) {
  			throw new Error('Le nom doit contenir uniquement des lettres.');
		}
		if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(data.speciality)) {
  			throw new Error('La spécialité doit contenir uniquement des lettres.');
		}
		if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(data.institution)) {
  			throw new Error('L\'établissement doit contenir uniquement des lettres.');
		}
		
		// Search for an existing pro by RPPS
		let pro = await proRepository.findByRpps(data.rpps);
		// If not found, create a new pro
		if (!pro) {
			pro = await proRepository.create(data);
		}

		// Generate a JWT for the pro
		const token = jwt.sign(
			{ id: pro.id, rpps: pro.rpps },
			SECRET_KEY,
			{ expiresIn: '3h' }
    );
		
		return { pro, token };
	}

	// Recover all Pro
	async getAllPros() {
		return proRepository.findAll();
	}

	// Recover a Pro by RPPS
	async getProByRpps(rpps) {
		if (!rpps) {
			throw new Error('RPPS manquante.');
		}
		if (!/^\d{11}$/.test(rpps)) {
    	throw new Error('Le numéro RPPS doit comporter exactement 11 chiffres.');
  	}

		return proRepository.findByRpps(rpps);
	}

  // Ajout de patients
  async addPatient(proId, patientId) {
    if (!proId || !patientId) {
      throw new Error("ID manquant");
    }
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      throw new Error("Patient introuvable");
    }
    const existingPatients = await proRepository.findPatients(proId);
    const alreadyLinked = existingPatients.find(p => p.id === Number(patientId));

    if (alreadyLinked) {
      throw new Error("Ce patient est déjà associé à ce pro");
    }
    const addedPatient = await proRepository.addPatient(proId, patientId);
    if (!addedPatient) {
      throw new Error("Erreur lors de l'ajout du patient");
    }
    return addedPatient;
  }

	// Retrieves all patients associated with a Pro
	async getAllPatients(proId, limit) {
		if (!proId) {
			throw new Error('Numéro d\'identifiant professionnel manquant.');
		}
		
		const pro = await proRepository.findById(proId);
		if (!pro) {
			throw new Error('Professionnel introuvable.');
		}
		return proRepository.findPatients(proId, limit);
	}

	// Retrieves a specific patient for a Pro
	async getPatient(proId, patientId) {
		if (!proId || !patientId) {
			throw new Error('Numéro d\'identification du professionnel ou du patient manquant.');
		}

		const patient = await proRepository.findPatient(proId, patientId);
		if (!patient) {
			throw new Error('Patient introuvable.');
		}

		return patient;
	}

	// Updates a Pro's information
	async updatePro(id, data) {
		if (!data) {
			throw new Error('Données manquantes.');
		}
		
		const pro = await proRepository.findById(id);
		if (!pro) {
			throw new Error('Professionnel introuvable.');
		}

		if (data.rpps !== pro.rpps) {
			throw new Error('Le RPPS ne peut pas être modifié.');
		}

		const updatedPro = await proRepository.update(id, data);
		if (!updatedPro) {
			throw new Error('Mise à jour impossible.');
		}

		return 'Mise à jour réussie.';
	}

	// Delete a Pro
	async deletePro(id) {
		const pro = await proRepository.findById(id);
		if (!pro) {
			throw new Error('Professionnel introuvable.');
		}

		const deletedPro = await proRepository.delete(id);
		if (!deletedPro) {
			throw new Error('Suppression impossible.');
		}

		return 'Suppression réussie.';
	}

  // Chercher des patients par nom pour un pro
  async searchPatients(proId, name) {
    if (!name) {
      throw new Error("Le nom du patient est requis.");
    }

    const patients = await proRepository.searchPatientsByName(proId, name);

    if (!patients || patients.length === 0) {
      throw new Error("Aucun patient trouvé avec ce nom.");
    }

    // Optionnel : formater les résultats
    return patients.map(p => ({
      id: p.id,
      name: p.name,
      age: p.age,
      email: p.email,
    }));
  }

  async searchAllPatients(name) {
    if (!name) throw new Error("Le nom du patient est requis.");

    const patients = await proRepository.searchAllPatientsByName(name);

    if (!patients || patients.length === 0) {
      throw new Error("Aucun patient trouvé avec ce nom.");
    }

    return patients.map(p => ({
      id: p.id,
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      birthDate: p.birthDate,
      alreadyLinked: p.Pros.length > 0,
    }));
  }
}