/**
* -------------------------------------------------------------------------
* proRepository.js
*
* -------------------------------------------------------------------------
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
* - addPatient(proId, patientId) → allows the professional to add a patient
*/
import BaseRepository from "./baseRepository.js";
import { Pro, Patient } from "../models/relationModel.js";
import { Op } from "sequelize";

class ProRepository extends BaseRepository {
  constructor() {
    super(Pro);
  }

  // Asynchronous method for finding a healthcare professional via their RPPS
  // `rpps` is a unique identifier for healthcare professionals
  async findByRpps(rpps) {
    return await Pro.findOne({ where: { rpps } });
  }

  // Method to retrieve all patients of a pro
  // `proId` is the pro's primary key
  async findPatients(proId) {
    // We retrieve the Pro and include its Patients via the defined alias
    const pro = await Pro.findByPk(proId, {
      include: { 
        model: Patient,
        as: "Patients",
        through: { attributes: [] },
      }
    });

    // If the Pro exists, return the list of its patients, otherwise empty array
    return pro ? pro.Patients : [];
  }

  // Method to retrieve a specific patient from a pro
  // `proId` -> pro identifier
  // `patientId` -> patient identifier (in the patient's `id` column)
  async findPatient(proId, patientId) {
    const pro = await Pro.findByPk(proId, {
      include: { model: Patient, as: "Patients" }
    });

    if (!pro) return null;

    // We are looking for the patient among those linked to this Pro
    return pro.Patients.find(p => p.id === Number(patientId)) || null;
  }

  // Adds a patient to the list of patients followed by a pro
  async addPatient(proId, patientId) {
    const pro = await Pro.findByPk(proId);
    const patient = await Patient.findByPk(patientId);

    if (!pro || !patient) {
      return null;
    } 

    await pro.addPatients(patient);
    return patient;
  }

  // Searches for a professional's patients by their name (partial, case-insensitive)
  async searchPatientsByName(proId, name) {
    if (!proId || !name) {
      throw new Error("Pro ou nom manquant.");
    }

    const patients = await Patient.findAll({
      include: [
        {
          model: Pro,
          as: "Pros",
          where: { id: proId },
          required: false,
          attributes: [], // we don't need professional data here
          through: { attributes: [] } // ignore the relationship table
        }
      ],
      where: {
        lastName: { [Op.iLike]: `%${name}%` }, // Case-insensitive search (PostgreSQL)
      },
    });

    return patients;
  }

  // Global search for patients by name (all professionals included)
  async searchAllPatientsByName(name) {
    if (!name) throw new Error("Nom du patient manquant.");

    const patients = await Patient.findAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.iLike]: `%${name}%` } },
          { lastName: { [Op.iLike]: `%${name}%` } },
        ],
      },
      include: [
        {
          model: Pro,
          as: "Pros",
          attributes: ["id"],
          through: { attributes: [] },
        },
      ],
    });

    return patients;
  }
}

export default new ProRepository();
