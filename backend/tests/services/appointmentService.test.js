import { Patient, Pro } from "../../models/relationModel.js";
import appointmentService from "../../services/appointmentService.js";
import appointmentRepository from "../../repositories/appointmentRepository.js";
/**
* UNIT TESTS — AppointmentService
*
* This file contains all the unit tests for the `AppointmentService`. 
* It uses the **Jest** framework to verify the correct functioning of the methods related
* to appointment management (creation, update, cancellation, etc.). 
*
* Objectives:
* - Verify that each service function responds correctly to valid and invalid inputs. 
* - Simulate the behavior of dependencies (repositories and Sequelize models) using `jest.mock`. 
* - Ensure that the business logic works independently of the actual database. 
*
* Modules tested:
* 1. **createAppointment** → creation of an appointment with validations (overlap, patient/professional existence, etc.)
* 2. **getAppointments** → retrieval of appointments for a professional or a patient. 
* 3. **cancelAppointment** → cancellation of an existing appointment. 
* 4. **updateAppointment** → updating appointment information. 
* 5. **updateStatus** → modification of the appointment status (Upcoming, Cancelled, Completed). 
* 6. **getEndTime** → calculation of the appointment end date/time. 
*
* Tools and methods:
* - `jest.mock()`: allows isolating the tested code by replacing database calls. 
* - `jest.clearAllMocks()`: resets the mocks before each test. 
* - `expect().toThrow()` and `expect().toHaveBeenCalledWith()`: verify errors and function calls. 
*
* In summary:
* These tests ensure that the appointment service functions correctly,
* handles validation errors, and interacts as expected with its dependencies. 
*/

jest.mock("../../repositories/appointmentRepository.js");
jest.mock("../../models/relationModel.js", () => ({
  Patient: { findByPk: jest.fn() },
  Pro: { findByPk: jest.fn() },
}));

describe("AppointmentService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- CREATE APPOINTMENT ---
  describe("createAppointment", () => {
    it("creates an appointment successfully", async () => {
      const mockAppointment = {
        toJSON: () => ({
          id: 1,
          dateTime: new Date("2025-10-26T10:00:00Z"),
          status: "À venir",
        }),
        dateTime: new Date("2025-10-26T10:00:00Z"),
        status: "À venir",
      };

      Patient.findByPk.mockResolvedValue({ id: 1 });
      Pro.findByPk.mockResolvedValue({ id: 2 });
      appointmentRepository.getAppointments.mockResolvedValue([]);
      appointmentRepository.createAppointment.mockResolvedValue(mockAppointment);

      const result = await appointmentService.createAppointment({
        proId: 2,
        patientId: 1,
        dateTime: "2025-10-26T10:00:00Z",
        duration: 60,
      });

      expect(appointmentRepository.createAppointment).toHaveBeenCalledWith(1, 2, "2025-10-26T10:00:00Z", 60);
      expect(result.status).toBe("À venir");
      expect(result.id).toBe(1);
    });

    it("raises an error if the professional is missing", async () => {
      await expect(
        appointmentService.createAppointment({ patientId: 1, dateTime: "2025-10-26T10:00:00Z", duration: 30 })
      ).rejects.toThrow("Seul un professionnel peut créer un rendez-vous");
    });

    it("raises an error if the patient is not found", async () => {
      Patient.findByPk.mockResolvedValue(null);
      await expect(
        appointmentService.createAppointment({ proId: 1, patientId: 1, dateTime: "2025-10-26T10:00:00Z", duration: 30 })
      ).rejects.toThrow("Patient non trouvé");
    });

    it("raises an error if the time slot is already taken", async () => {
      Patient.findByPk.mockResolvedValue({ id: 1 });
      Pro.findByPk.mockResolvedValue({ id: 2 });
      appointmentRepository.getAppointments.mockResolvedValue([
        { dateTime: "2025-10-26T10:00:00Z", duration: 60 },
      ]);
      await expect(
        appointmentService.createAppointment({
          proId: 2,
          patientId: 1,
          dateTime: "2025-10-26T10:30:00Z",
          duration: 30,
        })
      ).rejects.toThrow("Le créneau est déjà pris");
    });
  });

  // --- GET APPOINTMENTS ---
  describe("getAppointments", () => {
    it("returns the appointments of a professional", async () => {
      const mockAppointments = [
        {
          toJSON: () => ({
            id: 1,
            dateTime: new Date("2025-10-26T10:00:00Z"),
            status: "À venir",
          }),
          dateTime: new Date("2025-10-26T10:00:00Z"),
          status: "À venir",
        },
      ];
      appointmentRepository.getAppointments.mockResolvedValue(mockAppointments);

      const result = await appointmentService.getAppointments({ proId: 1 });
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("À venir");
    });

    it("raises an error if no ID is provided", async () => {
      await expect(appointmentService.getAppointments({})).rejects.toThrow(
        "Vous devez fournir un patient ou un professionnel"
      );
    });
  });

  // --- CANCEL APPOINTMENT ---
  describe("cancelAppointment", () => {
    it("cancels an appointment successfully", async () => {
      const mockAppointment = {
        toJSON: () => ({ id: 1, dateTime: new Date(), status: "Annulé" }),
        dateTime: new Date(),
        status: "Annulé",
      };
      appointmentRepository.cancelAppointment.mockResolvedValue(mockAppointment);

      const result = await appointmentService.cancelAppointment(1);
      expect(result.status).toBe("Annulé");
      expect(appointmentRepository.cancelAppointment).toHaveBeenCalledWith(1);
    });

    it("raises an error if the appointment is not found", async () => {
      appointmentRepository.cancelAppointment.mockResolvedValue(null);
      await expect(appointmentService.cancelAppointment(99)).rejects.toThrow("Rendez-vous non trouvé");
    });
  });

  // --- UPDATE APPOINTMENT ---
  describe("updateAppointment", () => {
    it("updates an appointment successfully", async () => {
      Patient.findByPk.mockResolvedValue({ id: 1 });
      Pro.findByPk.mockResolvedValue({ id: 2 });

      const mockAppointment = {
        toJSON: () => ({ id: 1, dateTime: new Date(), status: "À venir" }),
        dateTime: new Date(),
        status: "À venir",
      };
      appointmentRepository.updateAppointment.mockResolvedValue(mockAppointment);

      const result = await appointmentService.updateAppointment(1, {
        proId: 2,
        patientId: 1,
        dateTime: "2025-10-26T12:00:00Z",
        duration: 45,
      });

      expect(result.id).toBe(1);
      expect(appointmentRepository.updateAppointment).toHaveBeenCalled();
    });

    it("raises an error if the patient is not found", async () => {
      Patient.findByPk.mockResolvedValue(null);
      await expect(
        appointmentService.updateAppointment(1, { patientId: 999 })
      ).rejects.toThrow("Patient non trouvé");
    });

    it("raises an error if the professional is not found", async () => {
      Patient.findByPk.mockResolvedValue({ id: 1 });
      Pro.findByPk.mockResolvedValue(null);
      await expect(
        appointmentService.updateAppointment(1, { proId: 999 })
      ).rejects.toThrow("Professionnel non trouvé");
    });

    it("raises an error if the appointment is not found", async () => {
      Patient.findByPk.mockResolvedValue({ id: 1 });
      Pro.findByPk.mockResolvedValue({ id: 2 });
      appointmentRepository.updateAppointment.mockResolvedValue(null);
      await expect(
        appointmentService.updateAppointment(1, { proId: 2, patientId: 1 })
      ).rejects.toThrow("Rendez-vous non trouvé");
    });
  });

  // --- UPDATE STATUS ---
  describe("updateStatus", () => {
    it("updates the status successfully", async () => {
      const mockAppointment = {
        toJSON: () => ({ id: 1, status: "Terminé", dateTime: new Date() }),
        status: "Terminé",
        dateTime: new Date(),
      };
      appointmentRepository.updateStatus.mockResolvedValue(mockAppointment);

      const result = await appointmentService.updateStatus(1, "Terminé");
      expect(result.status).toBe("Terminé");
      expect(appointmentRepository.updateStatus).toHaveBeenCalledWith(1, "Terminé");
    });

    it("raises an error if the status is invalid", async () => {
      await expect(appointmentService.updateStatus(1, "Invalide")).rejects.toThrow("Statut invalide");
    });

    it("raises an error if the appointment is not found", async () => {
      appointmentRepository.updateStatus.mockResolvedValue(null);
      await expect(appointmentService.updateStatus(1, "Annulé")).rejects.toThrow("Rendez-vous non trouvé");
    });
  });

  // --- GET END TIME ---
  describe("getEndTime", () => {
    it("returns the appointment’s end date/time", () => {
      const mockAppointment = { dateTime: "2025-10-26T10:00:00Z", duration: 30 };
      appointmentRepository.getEndTime.mockReturnValue(new Date("2025-10-26T10:30:00Z"));

      const endTime = appointmentService.getEndTime(mockAppointment);
      expect(endTime).toEqual(new Date("2025-10-26T10:30:00Z"));
      expect(appointmentRepository.getEndTime).toHaveBeenCalledWith(mockAppointment);
    });
  });
});
