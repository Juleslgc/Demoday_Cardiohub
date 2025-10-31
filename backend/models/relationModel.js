import Pro from "./proModel.js";
import Patient from "./patientModel.js";
import Appointment from "./appointmentModel.js";
import Teleconsultation from "./teleconsultationModel.js";
import Note from "./noteModel.js";
/**
* -------------------------------------------------------------------------
* relationModel.js
*
* -------------------------------------------------------------------------
* File Purpose:
* This file centralizes **all the relationships between the Sequelize models**
* (Pro, Patient, Appointment, Teleconsultation, Note). 
*
* It allows Sequelize to understand how the different entities
* of the application are related to each other:
* - Who belongs to whom
* - Who has multiple elements
* - Who depends on what
*
* These associations facilitate data navigation:
* → Example: retrieving all appointments for a professional or
*    all teleconsultations for a patient becomes automatic. 
*/

/*
* PROFESSIONAL ↔ PATIENT RELATIONSHIP
* ------------------------------------------------------------
* - One professional can follow multiple patients
* - One patient can be followed by multiple professionals
* - Many-to-many relationship via the intermediate table "ProPatient"
*/
Pro.belongsToMany(Patient, { through: "ProPatient", as: "Patients" });
Patient.belongsToMany(Pro, { through: "ProPatient", as: "Pros" });

/*
* PROFESSIONAL ↔ APPOINTMENT RELATIONSHIP
* ------------------------------------------------------------
* - A Professional can have multiple Appointments
* - Each Appointment belongs to only one Professional
*/
Pro.hasMany(Appointment, { foreignKey: "proId", as: "appointments" });
Appointment.belongsTo(Pro, { foreignKey: "proId", as: "pro" });

/*
* RELATIONSHIP BETWEEN PATIENT AND APPOINTMENT
* ------------------------------------------------------------
* - A Patient can have multiple Appointments
* - Each Appointment belongs to only one Patient
*/
Patient.hasMany(Appointment, { foreignKey: "patientId", as: "appointments" });
Appointment.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });

/*
* RELATIONSHIP BETWEEN APPOINTMENT AND TELECONSULTATION
* ------------------------------------------------------------
* - Each appointment can be associated with only one teleconsultation.
* - If an appointment is deleted, the corresponding teleconsultation is also deleted.
*/
Appointment.hasOne(Teleconsultation, { foreignKey: "appointmentId", as: "teleconsultation", onDelete: "CASCADE" });
Teleconsultation.belongsTo(Appointment, { foreignKey: "appointmentId", as: "appointment", onDelete: "CASCADE" });

/*
* RELATIONSHIP BETWEEN PROFESSIONAL AND TELECONSULTATION
* ------------------------------------------------------------
* - A professional can have multiple teleconsultations
* - Each teleconsultation belongs to only one professional
*/
Pro.hasMany(Teleconsultation, { foreignKey: "proId", as: "teleconsultations" });
Teleconsultation.belongsTo(Pro, { foreignKey: "proId", as: "pro" });

/*
* RELATIONSHIP BETWEEN PATIENT AND TELECONSULTATION
* ------------------------------------------------------------
* - A Patient can have multiple Teleconsultations
* - Each Teleconsultation belongs to only one Patient
*/
Patient.hasMany(Teleconsultation, { foreignKey: "patientId", as: "teleconsultations" });
Teleconsultation.belongsTo(Patient, { foreignKey: "patientId", as: "patient" });

/*
* RELATIONSHIP BETWEEN APPOINTMENT AND NOTE
* ------------------------------------------------------------
* - An Appointment can have only one Note.
* - Each Note belongs to only one Appointment.
*/
Appointment.hasOne(Note, { foreignKey: "appointmentId", as: "note" });
Note.belongsTo(Appointment, { foreignKey: "appointmentId", as: "appointment" });

export { Pro, Patient, Appointment, Teleconsultation, Note };
