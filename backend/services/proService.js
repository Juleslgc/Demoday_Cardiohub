import ProRepository from '../repositories/proRepository.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const SECRET_KEY = process.env.JWT_SECRET;


// Create an instance of the repository to access the DB
const proRepository = new ProRepository();

export default class ProService {

	// Creates a new Pro or returns the existing Pro
	async createOrLoginPro(data) {
		if (!data) {
			throw new Error('Données manquantes.');
		}
		if (!/^\d{11}$/.test(data.rpps)) {
    	throw new Error('Le numéro RPPS doit comporter exactement 11 chiffres.');
  		}
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

	// Retrieves all patients associated with a Pro
	async getAllPatients(proId) {
		if (!proId) {
			throw new Error('Numéro d\'identifiant pro manquant.');
		}
		
		const pro = await proRepository.findById(proId);
		if (!pro) {
			throw new Error('Pro introuvable.');
		}
		return proRepository.findPatients(proId);
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
			throw new Error('Pro introuvable.');
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
			throw new Error('Pro introuvable.');
		}

		const deletedPro = await proRepository.delete(id);
		if (!deletedPro) {
			throw new Error('Suppression impossible.');
		}

		return 'Suppression réussie.';
	}
}