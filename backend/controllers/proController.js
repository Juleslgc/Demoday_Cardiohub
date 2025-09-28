import ProService from '../services/proService.js';

const proService = new ProService();

export default class ProController {

	// Creates a new Pro or returns the existing Pro
  static async createPro(req, res) {
		try {
			const pro = await proService.createPro(req.body);
			res.status(201).json(pro);
		} catch (err) {
			res.status(400).json({ message: err.message });
		}
	}

	// Recover a Pro by RPPS
	static async getProByRpps(req, res) {
		const { rpps } = req.params;
		try {
			const pro = await proService.getProByRpps(rpps);
			if (!pro) {
				return res.status(404).json({ message: 'Pro not found' });
			}
			res.status(200).json(pro);
		} catch (err) {
			res.status(400).json({ message: err.message });
		}
	}

	// Retrieves all patients associated with a Pro
	static async getAllPatients(req, res) {
    const { proId } = req.params;
    try {
      const patients = await proService.getAllPatients(proId);
      res.json(patients);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Retrieves a specific patient for a Pro
  static async getPatient(req, res) {
    const { proId, patientId } = req.params;
    try {
      const patient = await proService.getPatient(proId, patientId);
      res.json(patient);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  // Updates a Pro's information
  static async updatePro(req, res) {
    const { id } = req.params;
    try {
      const result = await proService.updatePro(id, req.body);
      res.json({ message: result });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Delete a Pro
  static async deletePro(req, res) {
    const { id } = req.params;
    try {
      const result = await proService.deletePro(id);
      res.json({ message: result });
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}