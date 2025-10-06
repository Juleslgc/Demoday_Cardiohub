/**
* Specific repository: ProRepository
*
* This repository manages interactions with healthcare professional (Pro) data
* and their patients.
*
* Inherits from BaseRepository to benefit from generic CRUD methods:
* - create, findById, findAll, findOne, update, delete
*
* Specific methods:
* - findByRpps(rpps) → searches for a pro by their unique RPPS number.
* - findPatients(proId) → retrieves all patients associated with a pro.
* - findPatient(proId, patientId) → retrieves a specific patient linked to a pro.
*/
import BaseRepository from './baseRepository.js';
import Pro from '../models/proModel.js';
import Patient from '../models/patientModel.js';

export default class ProRepository extends BaseRepository {
	constructor() {
		super(Pro);
	}

	// Asynchronous method for finding a healthcare professional via their RPPS
	// `rpps` is a unique identifier for healthcare professionals
	async findByRpps(rpps) {
		return await Pro.findOne({ where: { rpps } })
	}

	// Method to retrieve all patients of a pro
	// `proId` is the pro's primary key
	async findPatients(proId) {
		return await Patient.findAll({ where: { proId } });
	}

	// Method to retrieve a specific patient from a pro
	// `proId` -> pro identifier
	// `patientId` -> patient identifier (in the patient's `id` column)
	async findPatient(proId, patientId) {
		return await Patient.findOne({ where: { id: patientId, proId } });
	}
}
