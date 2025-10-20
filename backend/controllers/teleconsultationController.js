import TeleconsultationService from "../services/teleconsultationService.js";

const teleconsultationService = new TeleconsultationService();

export default class TeleconsultationController {
  // Crée une nouvelle téléconsultation à partir de l'ID d'un rendez-vous
  static async createTeleconsultation(req, res) {
    try {
      // Récupération de l'ID du rendez-vous depuis les paramètres d'URL
      const { appointmentId } = req.params;

      // Appel du service pour créer une téléconsultation liée à ce rendez-vous
      const teleconsultation = await teleconsultationService.createTeleconsultation(appointmentId);
      res.status(201).json(teleconsultation);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }

  // Récupère une téléconsultation associée à un rendez-vous
  static async getByAppointment(req, res) {
    try {
      // Récupération de l'ID du rendez-vous depuis les paramètres d'URL
      const { appointmentId } = req.params;

      // Appel du service pour obtenir la téléconsultation correspondante
      const teleconsultation = await teleconsultationService.getByAppointment(appointmentId);
      res.status(200).json(teleconsultation);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  }

  // Met à jour le statut d'une téléconsultation (ex: "en cours", "terminé", etc.)
  static async updateStatus(req, res) {
    try {
      // Récupération de l’ID de la téléconsultation depuis les paramètres d’URL
      const { id } = req.params;

      // Récupération du nouveau statut depuis le corps de la requête
      const { status } = req.body;

      // Appel du service pour mettre à jour le statut
      const updated = await teleconsultationService.updateStatus(id, status);
      res.status(200).json(updated);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}
