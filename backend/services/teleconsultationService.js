import TeleconsultationRepository from "../repositories/teleconsultationRepository.js";
import Appointment from "../models/appointmentModel.js";
import { v4 as uuidv4 } from "uuid";

const teleconsultationRepository = new TeleconsultationRepository();

export default class TeleconsultationService {
  // Crée une téléconsultation pour un rendez-vous existant.
  // Le pro et le patient sont récupérés depuis le rendez-vous.
  async createTeleconsultation(appointmentId) {
    // Vérifie si une téléconsultation existe déjà pour ce rendez-vous
    const existing = await teleconsultationRepository.findByAppointment(appointmentId);
    if (existing) {
      console.log("Téléconsultation déjà existante, renvoi du même lien :", existing.jitsiLink);
      return existing; // on renvoie la même instance sans recréer
    }
  
    // Vérifie que le rendez-vous existe
    const appointment = await Appointment.findByPk(appointmentId);
    if (!appointment) {
      throw new Error("Rendez-vous introuvable");
    }
  
    // Récupère automatiquement les IDs liés à l’appointment
    const { proId, patientId } = appointment;
  
    if (!proId || !patientId) {
      throw new Error("Le rendez-vous n’est pas lié à un professionnel ou un patient.");
    }
  
    // Génère un lien Jitsi unique
    const shortId = uuidv4().split("-")[0]; // prend juste le premier segment
    const jitsiLink = `https://meet.jit.si/consultation-${shortId}`;
  
    // Crée la téléconsultation avec tous les liens nécessaires
    const teleconsultation = await teleconsultationRepository.create({
      appointmentId,
      proId,
      patientId,
      jitsiLink,
      status: "scheduled", // statut par défaut
    });
  
    console.log(" Nouvelle téléconsultation créée :", teleconsultation.jitsiLink);
    return teleconsultation;
  }
  

  // Récupère la téléconsultation associée à un rendez-vous donné.
  async getByAppointment(appointmentId) {
    const teleconsultation = await teleconsultationRepository.findByAppointment(appointmentId);
    if (!teleconsultation) throw new Error("Aucune téléconsultation trouvée pour ce rendez-vous.");
    return teleconsultation;
  }

  // Met à jour le statut d'une téléconsultation (ex : "in_progress", "ended", "canceled").
  async updateStatus(id, status) {
    const validStatuses = ["scheduled", "in_progress", "ended", "canceled"];
    if (!validStatuses.includes(status)) {
      throw new Error("Statut invalide");
    }

    const updated = await teleconsultationRepository.updateStatus(id, status);
    if (!updated) throw new Error("Téléconsultation introuvable");

    return updated;
  }
}
