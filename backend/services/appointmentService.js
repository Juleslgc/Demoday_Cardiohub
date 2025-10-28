import appointmentRepository from "../repositories/appointmentRepository.js";
import { Patient, Pro, Appointment } from "../models/relationModel.js";

class AppointmentService {
  // Méthode pour la date et heure local
  formatDate(dateTime) {
  return new Date(dateTime).toLocaleString('fr-FR', { hour12: false });
}

  //Créer un rendez-vous (seul le pro peut créer)
  async createAppointment({ proId, patientId, dateTime, duration }) {
    if (!proId) {
      throw new Error('Seul un professionnel peut créer un rendez-vous');
    }
    const patient = await Patient.findByPk(patientId);
    if (!patient) {
      throw new Error('Patient non trouvé');
    }

    const pro = await Pro.findByPk(proId);
    if (!pro) {
      throw new Error('Professionnel non trouvé');
    }

    const startTime = new Date(dateTime);
    const endTime = new Date(startTime.getTime() + duration * 60000);

    // Récupérer tous les rdv du pro et du patient
    const existingAppointments = await appointmentRepository.getAppointments({ proId, patientId });

    // Vérifier chevauchement
    const conflict = existingAppointments.some(a => {
      const aStart = new Date(a.dateTime);
      const aEnd = new Date(aStart.getTime() + a.duration * 60000);
      return startTime < aEnd && endTime > aStart;
    });

    if (conflict) {
      throw new Error('Le créneau est déjà pris')
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

  // Récupérer les rendez-vous pour un patient ou un pro
  async getAppointments({ patientId = null, proId = null }) {
    if (!patientId && !proId) {
      throw new Error('Vous devez fournir un patient ou un professionnel');
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

  // Annuler un rendez-vous
  async cancelAppointment(id) {
    const appointment = await appointmentRepository.cancelAppointment(id);
    if (!appointment) {
      throw new Error('Rendez-vous non trouvé');
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

  // Mettre à jour un rendez-vous (date, durée, patient)
  async updateAppointment(id, { proId, dateTime, duration, patientId }) {
    if (patientId) {
      const patient = await Patient.findByPk(patientId);
      if (!patient) {
        throw new Error('Patient non trouvé');
      }
    }

    if (proId) {
      const pro = await Pro.findByPk(proId);
      if (!pro) {
        throw new Error('Professionnel non trouvé');
      }
    }
    const updated = await appointmentRepository.updateAppointment(id, { dateTime, duration, patientId });
    if (!updated) {
      throw new Error('Rendez-vous non trouvé');
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

  // Mettre à jour le status d'un rendez-vous
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

  // Calculer la date/heure de fin d'un rendez-vous
  getEndTime(appointment) {
    return appointmentRepository.getEndTime(appointment);
  }
}

export default new AppointmentService();
