import jwt from "jsonwebtoken";
import proRepository from "../../repositories/proRepository.js";
import { Patient } from "../../models/relationModel.js";
import proService from "../../services/proService.js";
/**
* UNIT TESTS — ProService
*
* This file contains all the unit tests for the `ProService` service. 
* The tests use **Jest** to verify the business logic related to healthcare professionals,
* including creation, updating, deletion, management of associated patients,
* and database searching. 
*
* All external dependencies (`jsonwebtoken`, `proRepository`, `relationModel`) are mocked
* using `jest.mock()` to isolate the service code and test only its internal logic. 
*
* Objectives:
* - Verify the creation or login of a professional using their RPPS number. 
* - Test the management of patients linked to a professional (adding, viewing, searching). 
* - Control the updating and deletion of a professional with consistency checks. 
* - Ensure the correct functioning of patient searches, including handling cases with no results. 
* - Guarantee the correct generation of a JWT token when creating/logging in a professional. 
*
* Modules tested:
* 1. **createOrLoginPro** → Creates or logs in a professional based on their RPPS number. 
* 2. **getAllPros** → Retrieves the list of all registered professionals. 
* 3. **getProByRpps** → Retrieves a professional based on their RPPS number, with validation. 
* 4. **addPatient** → Associates a patient with a professional if this link does not already exist. 
* 5. **getAllPatients** → Lists all patients associated with a professional. 
* 6. **getPatient** → Retrieves a specific patient associated with a professional. 
* 7. **updatePro** → Updates a professional's information without allowing modification of the RPPS number. 
* 8. **deletePro** → Deletes an existing professional after verifying their existence. 
* 9. **searchPatients** → Searches for patients associated with a professional by name.
* 10. **searchAllPatients** → Global patient search (all professionals combined). 
*
* Tools and techniques:
* - `jest.mock()`: to isolate the service and simulate dependencies. 
* - `expect(...).toHaveBeenCalledWith()`: to verify calls to the repositories. 
* - `expect(...).toThrow()`: to validate errors in cases of invalid input. 
* - `jest.clearAllMocks()`: to reset the mocks before each test. 
*
* In summary:
* These tests ensure the reliability of the `ProService` module, which manages healthcare professionals
* and their relationships with patients. They guarantee the consistency of business rules,
* security via JWT, and robustness against input errors. 
*/

jest.mock("jsonwebtoken");
jest.mock("../../repositories/proRepository.js");
jest.mock("../../models/relationModel.js", () => ({
  Patient: { findByPk: jest.fn() }
}));

describe("ProService", () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- CREATE OR LOGIN PRO ---
  describe("createOrLoginPro", () => {
    it("creates a new pro and generates a token", async () => {
      const data = {
        rpps: "12345678901",
        firstName: "Alice",
        lastName: "Dupont",
        speciality: "Cardiologie",
        institution: "Hopital"
      };

      proRepository.findByRpps.mockResolvedValue(null);
      proRepository.create.mockResolvedValue({ id: 1, rpps: "12345678901" });
      jwt.sign.mockReturnValue("fakeToken");

      const result = await proService.createOrLoginPro(data);

      expect(proRepository.findByRpps).toHaveBeenCalledWith("12345678901");
      expect(proRepository.create).toHaveBeenCalledWith(data);
      expect(result).toEqual({
        pro: { id: 1, rpps: "12345678901" },
        token: "fakeToken"
      });
    });

    it("returns an existing pro and generates a token", async () => {
      const existing = { id: 2, rpps: "12345678901" };
      proRepository.findByRpps.mockResolvedValue(existing);
      jwt.sign.mockReturnValue("token");

      const data = {
        rpps: "12345678901",
        firstName: "Bob",
        lastName: "Martin",
        speciality: "Pediatrie",
        institution: "Clinique"
      };

      const result = await proService.createOrLoginPro(data);

      expect(proRepository.create).not.toHaveBeenCalled();
      expect(result.pro).toBe(existing);
      expect(result.token).toBe("token");
    });

    it("throws an error if RPPS is invalid", async () => {
      await expect(proService.createOrLoginPro({ rpps: "1234" }))
        .rejects.toThrow("Le numéro RPPS doit comporter exactement 11 chiffres.");
    });
  });

  // --- GET ALL PROS ---
  describe("getAllPros", () => {
    it("returns a list of pros", async () => {
      proRepository.findAll.mockResolvedValue([{ id: 1 }]);
      const result = await proService.getAllPros();
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  // --- GET PRO BY RPPS ---
  describe("getProByRpps", () => {
    it("returns the found pro", async () => {
      proRepository.findByRpps.mockResolvedValue({ id: 1 });
      const result = await proService.getProByRpps("12345678901");
      expect(result).toEqual({ id: 1 });
    });

    it("throws an error if RPPS is missing", async () => {
      await expect(proService.getProByRpps("")).rejects.toThrow("RPPS manquante.");
    });
  });

  // --- ADD PATIENT ---
  describe("addPatient", () => {
    it("adds a patient successfully", async () => {
      Patient.findByPk.mockResolvedValue({ id: 10 });
      proRepository.findPatients.mockResolvedValue([]);
      proRepository.addPatient.mockResolvedValue({ id: 10 });

      const result = await proService.addPatient(1, 10);

      expect(result).toEqual({ id: 10 });
      expect(proRepository.addPatient).toHaveBeenCalledWith(1, 10);
    });

    it("throws an error if the patient is already linked", async () => {
      Patient.findByPk.mockResolvedValue({ id: 10 });
      proRepository.findPatients.mockResolvedValue([{ id: 10 }]);
      await expect(proService.addPatient(1, 10))
        .rejects.toThrow("Ce patient est déjà associé à ce pro");
    });

    it("throws an error if the patient does not exist", async () => {
      Patient.findByPk.mockResolvedValue(null);
      await expect(proService.addPatient(1, 99))
        .rejects.toThrow("Patient introuvable");
    });
  });

  // --- GET ALL PATIENTS ---
  describe("getAllPatients", () => {
    it("returns the list of patients", async () => {
      proRepository.findById.mockResolvedValue({ id: 1 });
      proRepository.findPatients.mockResolvedValue([{ id: 1, name: "Alice" }]);
      const result = await proService.getAllPatients(1);
      expect(result).toEqual([{ id: 1, name: "Alice" }]);
    });

    it("throws an error if pro not found", async () => {
      proRepository.findById.mockResolvedValue(null);
      await expect(proService.getAllPatients(1))
        .rejects.toThrow("Professionnel introuvable.");
    });
  });

  // --- GET PATIENT ---
  describe("getPatient", () => {
    it("returns the patient if found", async () => {
      proRepository.findPatient.mockResolvedValue({ id: 2 });
      const result = await proService.getPatient(1, 2);
      expect(result).toEqual({ id: 2 });
    });

    it("throws an error if patient not found", async () => {
      proRepository.findPatient.mockResolvedValue(null);
      await expect(proService.getPatient(1, 2))
        .rejects.toThrow("Patient introuvable.");
    });
  });

  // --- UPDATE PRO ---
  describe("updatePro", () => {
    it("updates a pro successfully", async () => {
      const pro = { id: 1, rpps: "12345678901" };
      proRepository.findById.mockResolvedValue(pro);
      proRepository.update.mockResolvedValue(true);
      const result = await proService.updatePro(1, { rpps: "12345678901", firstName: "New" });
      expect(result).toBe("Mise à jour réussie.");
    });

    it("throws an error if RPPS is changed", async () => {
      proRepository.findById.mockResolvedValue({ id: 1, rpps: "123" });
      await expect(proService.updatePro(1, { rpps: "456" }))
        .rejects.toThrow("Le RPPS ne peut pas être modifié.");
    });

    it("throws an error if pro not found", async () => {
      proRepository.findById.mockResolvedValue(null);
      await expect(proService.updatePro(1, {}))
        .rejects.toThrow("Professionnel introuvable.");
    });
  });

  // --- DELETE PRO ---
  describe("deletePro", () => {
    it("deletes a pro", async () => {
      proRepository.findById.mockResolvedValue({ id: 1 });
      proRepository.delete.mockResolvedValue(true);
      const result = await proService.deletePro(1);
      expect(result).toBe("Suppression réussie.");
    });

    it("throws an error if pro not found", async () => {
      proRepository.findById.mockResolvedValue(null);
      await expect(proService.deletePro(1))
        .rejects.toThrow("Professionnel introuvable.");
    });
  });

  // --- SEARCH PATIENTS ---
  describe("searchPatients", () => {
    it("returns formatted patients", async () => {
      proRepository.searchPatientsByName.mockResolvedValue([
        { id: 1, name: "Alice", age: 40, email: "a@a.com" }
      ]);
      const result = await proService.searchPatients(1, "Alice");
      expect(result).toEqual([
        { id: 1, name: "Alice", age: 40, email: "a@a.com" }
      ]);
    });

    it("throws an error if no patient found", async () => {
      proRepository.searchPatientsByName.mockResolvedValue([]);
      await expect(proService.searchPatients(1, "X"))
        .rejects.toThrow("Aucun patient trouvé avec ce nom.");
    });
  });

  // --- SEARCH ALL PATIENTS ---
  describe("searchAllPatients", () => {
    it("returns all formatted patients", async () => {
      proRepository.searchAllPatientsByName.mockResolvedValue([
        {
          id: 1,
          firstName: "Bob",
          lastName: "Martin",
          email: "b@b.com",
          birthDate: "1980-01-01",
          Pros: [{}],
        },
      ]);
      const result = await proService.searchAllPatients("Bob");
      expect(result).toEqual([
        {
          id: 1,
          firstName: "Bob",
          lastName: "Martin",
          email: "b@b.com",
          birthDate: "1980-01-01",
          alreadyLinked: true,
        },
      ]);
    });

    it("throws an error if no patient found", async () => {
      proRepository.searchAllPatientsByName.mockResolvedValue([]);
      await expect(proService.searchAllPatients("X"))
        .rejects.toThrow("Aucun patient trouvé avec ce nom.");
    });
  });
});
