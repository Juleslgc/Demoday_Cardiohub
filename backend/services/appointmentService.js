import appointmentRepository from "../repositories/appointmentRepository.js";
import { Patient, Pro} from "../models/relationModel.js";
/**
* -------------------------------------------------------------------------
* appointmentService.js
*
* -------------------------------------------------------------------------
* This service manages the business logic related to appointments in the application. 
*
* Main functionalities:
* - Creating appointments by a professional for a patient
* - Checking for scheduling conflicts
* - Retrieving appointments for a patient or a professional
* - Updating appointments (date, duration)
* - Canceling and updating the status ("Upcoming", "Canceled", "Completed")
* - Calculating the end date/time of an appointment
*
* Notes:
* - All dates are formatted in French locale for display
* - Uses the `appointmentRepository` repository for all CRUD operations
* - Checks for the existence of patients and professionals before any action
*/

class AppointmentService {
  // Formatting the date and time in French locale -> Used to display the date/time in the frontend
  formatDate(dateTime) {
    return new Date(dateTime).toLocaleString("fr-FR", { hour12: false });
  }

  /**
  * Creates an appointment for a professional and a patient.
  * - Checks that the professional and the patient exist.
  * - Checks that no existing appointment overlaps with the chosen time slot.
  * - Returns the appointment with formatted date and readable status.
  */
  async createAppointment({ proId, patientId, dateTime, duration }) {
    if (!proId) {
      throw new Error("Seul un professionnel peut créer un rendez-vous");
    }
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      throw new Error("Patient non trouvé");
    }

    const pro = await Pro.findByPk(proId);
    if (!pro) {
      throw new Error("Professionnel non trouvé");
    }

    const startTime = new Date(dateTime);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    // Retrieve all appointments for the professional and the patient
    const existingAppointments = await appointmentRepository.getAppointments({ proId });

    // Check for appointment overlap
    const conflict = existingAppointments.some(a => {
      const aStart = new Date(a.dateTime);
      const aEnd = new Date(aStart.getTime() + a.duration * 60000);
      return startTime < aEnd && endTime > aStart;
    });

    if (conflict) {
      throw new Error("Le créneau est déjà pris");
    }

    const appointment = await appointmentRepository.createAppointment(patientId, proId, dateTime, duration);

    const statusMap = {
      "A venir": "À venir",
      "Annulé": "Annulé",
      "Terminé": "Terminé",
    };

    return {
      ...appointment.toJSON(),
      dateTime: this.formatDate(appointment.dateTime),
      status: statusMap[appointment.status] || appointment.status,
    };
  }

  /**
  * Retrieves appointments for a patient or a professional.
  * - If no parameters are provided, returns an error.
  * - Returns the list with formatted dates and readable statuses.
  */
  async getAppointments({ patientId = null, proId = null }) {
    if (!patientId && !proId) {
      throw new Error("Vous devez fournir un patient ou un professionnel");
    }
    const appointments = await appointmentRepository.getAppointments({ patientId, proId });

    const statusMap = {
      "A venir": "À venir",
      "Annulé": "Annulé",
      "Terminé": "Terminé",
    };

    return appointments.map(a => ({
      ...a.toJSON(),
      dateTime: this.formatDate(a.dateTime),
      status: statusMap[a.status] || a.status,
    }));
  }

  /**
  * Cancels an existing appointment
  * - Changes the status to "Cancelled"
  * - Returns the appointment with formatted date and readable status
  */
  async cancelAppointment(id) {
    const appointment = await appointmentRepository.cancelAppointment(id);
    if (!appointment) {
      throw new Error("Rendez-vous non trouvé");
    }
    const statusMap = {
      "A venir": "À venir",
      "Annulé": "Annulé",
      "Terminé": "Terminé",
    };

    return {
      ...appointment.toJSON(),
      dateTime: this.formatDate(appointment.dateTime),
      status: statusMap[appointment.status] || appointment.status
    };
  }

  /**
  * Updates an existing appointment.
  * - Can update the date, duration, patient, or practitioner.
  * - Checks that the patient and practitioner exist.
  * - Returns the updated appointment with formatted date and readable status.
  */
  async updateAppointment(id, { proId, dateTime, duration, patientId }) {
    if (patientId) {
      const patient = await Patient.findByPk(patientId);
      if (!patient) {
        throw new Error("Patient non trouvé");
      }
    }

    if (proId) {
      const pro = await Pro.findByPk(proId);
      if (!pro) {
        throw new Error("Professionnel non trouvé");
      }
    }
    const updated = await appointmentRepository.updateAppointment(id, { dateTime, duration, patientId });
    if (!updated) {
      throw new Error("Rendez-vous non trouvé");
    }

    const statusMap = {
      "A venir": "À venir",
      "Annulé": "Annulé",
      "Terminé": "Terminé",
    };
    
    return {
      ...updated.toJSON(),
      dateTime: this.formatDate(updated.dateTime),
      status: statusMap[updated.status] || updated.status
    };
  }

  /**
  * Updates the status of an appointment.
  * - Only valid statuses are accepted: "Upcoming", "Cancelled", "Completed"
  * - Returns the appointment with formatted date and readable status.
  */
  async updateStatus(id, status) {
    const validStatuses = ["À venir", "Annulé", "Terminé"];
    if (!validStatuses.includes(status)) throw new Error("Statut invalide");

    const appointment = await appointmentRepository.updateStatus(id, status);
    if (!appointment) throw new Error("Rendez-vous non trouvé");

    const statusMap = {
      "A venir": "À venir",
      "Annulé": "Annulé",
      "Terminé": "Terminé",
    };

    return {
      ...appointment.toJSON(),
      dateTime: this.formatDate(appointment.dateTime),
      status: statusMap[appointment.status] || appointment.status
    };
  }

  /**
  * Calculates the end date/time of an appointment.
  * - Useful for conflict checking or display purposes.
  */
  getEndTime(appointment) {
    return appointmentRepository.getEndTime(appointment);
  }
}

export default new AppointmentService();
