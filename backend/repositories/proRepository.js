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
import { Pro, Patient } from '../models/relationModel.js'

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
    // On récupère le Pro et on inclut ses Patients via l'alias défini
    const pro = await Pro.findByPk(proId, {
      include: { 
        model: Patient,
        as: 'Patients',
        through: { attributes: [] },
      }
    });

    // Si le Pro existe, retourner la liste de ses patients, sinon tableau vide
    return pro ? pro.Patients : [];
  }

	// Method to retrieve a specific patient from a pro
	// `proId` -> pro identifier
	// `patientId` -> patient identifier (in the patient's `id` column)
	async findPatient(proId, patientId) {
    const pro = await Pro.findByPk(proId, {
      include: { model: Patient, as: 'Patients' }
    });

    if (!pro) return null;

    // On cherche le patient parmi ceux liés à ce Pro
    return pro.Patients.find(p => p.id === Number(patientId)) || null;
  }

  async addPatient(proId, patientId) {
    const pro = await Pro.findByPk(proId);
    const patient = await Patient.findByPk(patientId);

    if (!pro || !patient) {
      return null;
    } 

    await pro.addPatients(patient);
    return patient;
  }
}
