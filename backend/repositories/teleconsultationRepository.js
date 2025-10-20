import Teleconsultation from "../models/teleconsultationModel.js";
import Appointment from "../models/appointmentModel.js";
import Pro from "../models/proModel.js";
import Patient from "../models/patientModel.js";

export default class TeleconsultationRepository {
  // Crée une nouvelle téléconsultation liée à un rendez-vous
  async create({ appointmentId, proId, patientId, jitsiLink, status = "scheduled" }) {
    return await Teleconsultation.create({
      appointmentId,
      proId,
      patientId,
      jitsiLink,
      status,
    });
  }

  // Récupère une téléconsultation par son rendez-vous
  async findByAppointment(appointmentId) {
    return await Teleconsultation.findOne({
      where: { appointmentId },
      include: [
        { model: Appointment, as: "appointment" },
        { model: Pro, as: "pro" },
        { model: Patient, as: "patient" },
      ],
    });
  }

  // Récupère une téléconsultation par son ID
  async findById(id) {
    return await Teleconsultation.findByPk(id, {
      include: [
        { model: Appointment, as: "appointment" },
        { model: Pro, as: "pro" },
        { model: Patient, as: "patient" },
      ],
    });
  }

  // Met à jour le statut d’une téléconsultation
  async updateStatus(id, status) {
    const teleconsultation = await Teleconsultation.findByPk(id);
    if (!teleconsultation) return null;

    teleconsultation.status = status;
    await teleconsultation.save();

    return teleconsultation;
  }

}
