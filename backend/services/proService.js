import ProRepository from '../repositories/proRepository.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
const SECRET_KEY = process.env.JWT_SECRET;


// Create an instance of the repository to access the DB
const proRepository = new ProRepository();

export default class ProService {

	// Creates a new Pro or returns the existing Pro
	async createPro(data) {
		if (!data) {
			throw new Error('Missing data');
		}
		if (!/^\d{11}$/.test(data.rpps)) {
    	throw new Error('The RPPS must contain exactly 11 digits');
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
			throw new Error('Missing rpps');
		}
		if (!/^\d{11}$/.test(rpps)) {
    	throw new Error('The RPPS must contain exactly 11 digits');
  	}

		return proRepository.findByRpps(rpps);
	}

	// Retrieves all patients associated with a Pro
	async getAllPatients(proId) {
		if (!proId) {
			throw new Error('Missing proId');
		}
		
		const pro = await proRepository.findById(proId);
		if (!pro) {
			throw new Error('Pro not found');
		}
		return proRepository.findPatients(proId);
	}

	// Retrieves a specific patient for a Pro
	async getPatient(proId, patientId) {
		if (!proId || !patientId) {
			throw new Error('Missing proId or patientId');
		}

		const patient = await proRepository.findPatient(proId, patientId);
		if (!patient) {
			throw new Error('Patient not found');
		}

		return patient;
	}

	// Updates a Pro's information
	async updatePro(id, data) {
		if (!data) {
			throw new Error('Missing data');
		}
		
		const pro = await proRepository.findById(id);
		if (!pro) {
			throw new Error('Pro not found');
		}

		if (data.rpps !== pro.rpps) {
			throw new Error('The RPPS cannot be changed');
		}

		const updatedPro = await proRepository.update(id, data);
		if (!updatedPro) {
			throw new Error('Udated not possible');
		}

		return 'Update successful';
	}

	// Delete a Pro
	async deletePro(id) {
		const pro = await proRepository.findById(id);
		if (!pro) {
			throw new Error('Pro not found');
		}

		const deletedPro = await proRepository.delete(id);
		if (!deletedPro) {
			throw new Error('Delete not possible');
		}

		return 'Delete successful';
	}
}