import BaseRepository from "./baseRepository.js";
import { Pro, Patient, Appointment } from "../models/relationModel.js";

export default class AppointmentRepository extends BaseRepository {
  constructor() {
    super(Appointment);
  }

  // Créer un rendez-vous
  async createAppointment(patientId, proId, dateTime, duration) {
    const appointment = await Appointment.create({
      patientId,
      proId,
      dateTime: new Date(dateTime),
      duration,
      status: "À  venir"
    });
    return appointment;
  }

  // Récupérer les rendez-vous pour un patient, un pro ou les deux
  async getAppointments({ patientId = null, proId = null }) {
    const where = {};
    if (patientId) {
      where.patientId = patientId;
    }
    if (proId) {
      where.proId = proId;
    }
    return Appointment.findAll({
      where,
      include: [
        { model: Patient, as: "patient" },
        { model: Pro, as: "pro" },
      ],
      order: [["dateTime", "ASC"]],
    });
  }

  // Annuler un rendez-vous
  async cancelAppointment(id) {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return null;
    
    appointment.status = "Annulé";
    await appointment.save()
    return appointment;
  }

  // Mettre à jour un rendez-vous (date, durée, patient)
  async updateAppointment(id, { dateTime, duration, patientId }) {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return null;

    if (dateTime) appointment.dateTime = dateTime;
    if (duration) appointment.duration = duration;
    if (patientId) appointment.patientId = patientId;

    await appointment.save();
    return appointment;
  }

  // Mettre à jour le status
  async updateStatus(id, status) {
    const validStatuses = ["À venir", "Annulé", "Terminé"];
    if (!validStatuses.includes(status)) return null;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) return null;

    appointment.status = status;
    await appointment.save();
    return appointment;
  }

  //Calculer la date/heure de fin
  getEndTime(appointment) {
    const datetime = new Date(appointment.dateTime);
    return new Date(datetime.getTime() + appointment.duration * 60000);
  }
}