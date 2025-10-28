import Pro from "./proModel.js";
import Patient from "./patientModel.js";
import Appointment from "./appointmentModel.js";
import Teleconsultation from "./teleconsultationModel.js";
import Note from "./noteModel.js";

// Relation plusieurs-à-plusieurs
Pro.belongsToMany(Patient, { through: "ProPatient", as: "Patients" });
Patient.belongsToMany(Pro, { through: "ProPatient", as: "Pros" });

// Relation Pro Appointment
Pro.hasMany(Appointment, { foreignKey: "proId", as: "appointments" });
Appointment.belongsTo(Pro, { foreignKey: "proId", as: "pro" });

// Relation Patient Appointment
Patient.hasMany(Appointment, { foreignKey: "patientId", as: "appointments" });
Appointment.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });

// Relation Teleconsultation Appointment
Appointment.hasOne(Teleconsultation, { foreignKey: "appointmentId", as: "teleconsultation", onDelete: "CASCADE" });
Teleconsultation.belongsTo(Appointment, { foreignKey: "appointmentId", as: "appointment", onDelete: "CASCADE" });

// Relation Pro Teleconsultation
Pro.hasMany(Teleconsultation, { foreignKey: "proId", as: "teleconsultations" });
Teleconsultation.belongsTo(Pro, { foreignKey: "proId", as: "pro" });

// Relation Patient Teleconsultation
Patient.hasMany(Teleconsultation, { foreignKey: "patientId", as: "teleconsultations" });
Teleconsultation.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });

// Relation Teleconsultation Note
Teleconsultation.hasOne(Note, { foreignKey: "teleconsultationId", as: "note" });
Note.belongsTo(Teleconsultation, { foreignKey: "teleconsultationId", as: "teleconsultation" });

export { Pro, Patient, Appointment, Teleconsultation, Note };
