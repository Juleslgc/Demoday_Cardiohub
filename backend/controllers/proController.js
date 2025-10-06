/**
* This file defines the `ProController` controller, which handles all HTTP requests
* related to healthcare professionals (Pro).
*
* The controller acts as an interface between:
* - the "route" layer (Express endpoints),
* - and the "service" layer (ProService), which contains the business logic.
*
* Main objective:
* Centralize the logic related to healthcare professional management: creation, login,
* retrieval, update, and deletion, as well as the management of their patients.
*
* General structure:
* - Each method corresponds to a specific route.
* - The methods call the service functions (`proService`) and return
* an appropriate JSON response with an HTTP code.
*/
import ProService from '../services/proService.js';

const proService = new ProService();

export default class ProController {

	// Creates a new Pro or returns the existing Pro
  static async createOrLoginPro(req, res) {
		try {
			const pro = await proService.createOrLoginPro(req.body); // Call the service with the data from the request body
			res.status(201).json(pro); // Response with the pro created or found
		} catch (err) {
			res.status(400).json({ message: err.message }); // Validation error or other
		}
	}

  // Recover all Pro
  static async getAllPros(req, res) {
    try {
      const pros = await proService.getAllPros(); // Call the service to retrieve all the pros
      res.status(200).json(pros);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

	// Recover a Pro by RPPS
	static async getProByRpps(req, res) {
		const { rpps } = req.params; // Extract the RPPS parameter from the URL
		try {
			const pro = await proService.getProByRpps(rpps); // Search via the service
			if (!pro) {
                // If no professional found -> code 404
				return res.status(404).json({ message: 'Pro introuvable' });
			}
			res.status(200).json(pro);
		} catch (err) {
			res.status(400).json({ message: err.message });
		}
	}

	// Retrieves all patients associated with a Pro
	static async getAllPatients(req, res) {
    const { proId } = req.params; // Extract the professional ID parameter from the URL
    try {
      const patients = await proService.getAllPatients(proId); // Retrieves patients linked to the professional's ID
      res.json(patients);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Retrieves a specific patient for a Pro
  static async getPatient(req, res) {
    const { proId, patientId } = req.params; // Extract the professional and patient ID parameter from the URL
    try {
      const patient = await proService.getPatient(proId, patientId); // Retrieves the patient
      res.json(patient);
    } catch (err) {
      res.status(404).json({ message: err.message }); // Patient not found or other error
    }
  }

  // Updates a Pro's information
  static async updatePro(req, res) {
    const { id } = req.params; // ID of the professional to modify
    try {
      const result = await proService.updatePro(id, req.body); // Update via service
      res.json({ message: result }); // Returns a confirmation message
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Delete a Pro
  static async deletePro(req, res) {
    const { id } = req.params; // ID of the pro to delete
    try {
      const result = await proService.deletePro(id); // Deletion via the service
      res.json({ message: result });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}