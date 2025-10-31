import BaseRepository from "./baseRepository.js";
import { Pro, Patient, Appointment } from "../models/relationModel.js";
/**
* -------------------------------------------------------------------------
* appointmentRepository.js
*
* -------------------------------------------------------------------------
* This file manages all interactions between the `Appointment` model and the database. 
* It centralizes the logic related to appointments: creation, retrieval, updating,
* cancellation, and duration calculation. 
*
* The repository serves as an intermediary layer between the database (Sequelize)
* and the business services. It ensures better separation of concerns,
* code reusability, and easier maintenance. 
*
* This module inherits from `BaseRepository`, allowing it to use generic methods
* while adding operations specific to appointments. 
*/

class AppointmentRepository extends BaseRepository {
  constructor() {
    super(Appointment);
  }

  // Create a new appointment
  async createAppointment(patientId, proId, dateTime, duration) {
    const appointment = await Appointment.create({
      patientId,
      proId,
      dateTime: new Date(dateTime),
      duration,
      status: "À venir"
    });
    return appointment;
  }

  // Retrieve appointments for a patient, a professional, or both.
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

  // Cancel an appointment
  async cancelAppointment(id) {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return null;
    
    appointment.status = "Annulé";
    await appointment.save();
    return appointment;
  }

  // Update an appointment (date, duration)
  async updateAppointment(id, { dateTime, duration, patientId }) {
    const appointment = await Appointment.findByPk(id);
    if (!appointment) return null;

    if (dateTime) appointment.dateTime = dateTime;
    if (duration) appointment.duration = duration;
    if (patientId) appointment.patientId = patientId;

    await appointment.save();
    return appointment;
  }

  // Update the appointment status
  async updateStatus(id, status) {
    const validStatuses = ["À venir", "Annulé", "Terminé"];
    if (!validStatuses.includes(status)) return null;

    const appointment = await Appointment.findByPk(id);
    if (!appointment) return null;

    appointment.status = status;
    await appointment.save();
    return appointment;
  }

  // Calculate the end date/time of the appointment
  getEndTime(appointment) {
    const datetime = new Date(appointment.dateTime);
    return new Date(datetime.getTime() + appointment.duration * 60000);
  }
}

export default new AppointmentRepository();
