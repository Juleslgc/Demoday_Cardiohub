import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import patientRepository from "../../repositories/patientRepository.js";
import { Patient } from "../../models/relationModel.js";
import patientService from "../../services/patientService.js";
/**
* UNIT TESTS — PatientService
*
* This file contains all the unit tests for the `PatientService`. 
* These tests use **Jest** to verify the correct functioning of operations
* related to patient management: creation, login, update, and deletion. 
* All external dependencies (bcrypt, jsonwebtoken, repository, Sequelize models)
* are mocked using `jest.mock` to isolate the business logic. 
*
* Objectives:
* - Verify the creation of a patient with an encrypted password and strict validations. 
* - Test retrieving, updating, and deleting a patient in different scenarios. 
* - Control validation rules: secure password, valid email, consistent date of birth, etc.
* - Ensure that authentication (login) correctly generates a JWT token if the credentials are valid. 
*
* Modules tested:
* 1. **registerPatient** → Creates a new patient after verifications (unique email, strong password, etc.). 
* 2. **getPatientById** → Retrieves a patient by their ID. 
* 3. **updatePatient** → Updates the patient's data, re-hashing the password if necessary. 
* 4. **deletePatient** → Deletes an existing patient. 
* 5. **getByEmail** → Searches for a patient by email with format validation and error handling. 
* 6. **login** → Authenticates a patient and returns a JWT token if the password is correct. 
*
* Tools and techniques:
* - `jest.mock()`: Mocks dependencies such as bcrypt, jsonwebtoken, and repositories. 
* - `expect(...).toThrow()`: Checks for errors in invalid cases. 
* - `expect(...).toHaveBeenCalledWith()`: Validates method calls with the correct arguments. 
* - `jest.clearAllMocks()`: Resets all mocks before each test.
*
* In summary:
* These tests guarantee the reliability of the patient service by validating its business logic,
* its security (hashing, JWT token), and its robustness against user input errors. 
*/

jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../repositories/patientRepository.js");
jest.mock("../../models/relationModel.js", () => ({
  Patient: { scope: jest.fn().mockReturnThis(), findOne: jest.fn() }
}));

describe("PatientService", () => {

  // --- REGISTER PATIENT ---
  describe("registerPatient", () => {
    it("must create a patient with a hashed password", async () => {
      const data = {
        firstName: "Alice",
        lastName: "Dupont",
        email: "alice@example.com",
        password: "P@ssword123",
        birthDate: "1990-01-01"
      };
      patientRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      patientRepository.create.mockResolvedValue({ id: 1, ...data });

      const result = await patientService.registerPatient(data);

      expect(patientRepository.findByEmail).toHaveBeenCalledWith("alice@example.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("P@ssword123", 10);
      expect(patientRepository.create).toHaveBeenCalled();
      expect(result).toEqual({
        message: expect.any(String),
        userId: 1
      });
    });

    it("must raise an error if the email already exists", async () => {
      const data = { email: "test@example.com", firstName: "A", lastName: "B", password: "Test@1234", birthDate: "1990-01-01" };
      patientRepository.findByEmail.mockResolvedValue({ id: 1 });
      await expect(patientService.registerPatient(data)).rejects.toThrow("Email déjà utilisé");
    });

    it("must raise an error if the date of birth is in the future", async () => {
      const futureDate = new Date();
      futureDate.setFullYear(futureDate.getFullYear() + 1);
      const data = { firstName: "A", lastName: "B", email: "a@a.com", password: "Test@1234", birthDate: futureDate.toISOString() };
      patientRepository.findByEmail.mockResolvedValue(null);
      await expect(patientService.registerPatient(data)).rejects.toThrow("La date de naissance ne peut pas être dans le futur.");
    });

    it("must raise an error if the password is weak", async () => {
      const data = {
        firstName: "Alice",
        lastName: "Dupont",
        email: "alice@example.com",
        password: "abc123",
        birthDate: "1990-01-01"
      };

      patientRepository.findByEmail.mockResolvedValue(null);

      await expect(patientService.registerPatient(data))
        .rejects
        .toThrow("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
    });

    it("must accept a strong password", async () => {
      const data = {
        firstName: "Alice",
        lastName: "Dupont",
        email: "alice@example.com",
        password: "Azerty1@",
        birthDate: "1990-01-01"
      };

      patientRepository.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword");
      patientRepository.create.mockResolvedValue({ id: 1, ...data });

      const result = await patientService.registerPatient(data);

      expect(bcrypt.hash).toHaveBeenCalledWith("Azerty1@", 10);
      expect(result).toEqual({
        message: expect.any(String),
        userId: 1
      });
    });

    it("must raise an error if the phone number is invalid", async () => {
      const data = {
        firstName: "Alice",
        lastName: "Dupont",
        email: "alice@example.com",
        password: "Azerty1@",
        phone: "12345",
        birthDate: "1990-01-01"
      };

      patientRepository.findByEmail.mockResolvedValue(null);
      await expect(patientService.registerPatient(data))
        .rejects
        .toThrow("Le numéro de téléphone doit comporter exactement 10 chiffres.");
    });

  });

  // --- GET PATIENT BY ID ---
  describe("getPatientById", () => {
    it("returns a patient if found", async () => {
      patientRepository.findById.mockResolvedValue({ id: 1, name: "Alice" });
      const result = await patientService.getPatientById(1);
      expect(result).toEqual({ id: 1, name: "Alice" });
    });

    it("raises an error if the patient is not found", async () => {
      patientRepository.findById.mockResolvedValue(null);
      await expect(patientService.getPatientById(999)).rejects.toThrow("Patient introuvable");
    });
  });

  // --- UPDATE PATIENT ---
  describe("updatePatient", () => {
    it("hash the password if provided", async () => {
      bcrypt.hash.mockResolvedValue("hashed");
      patientRepository.update.mockResolvedValue({ id: 1 });
      const result = await patientService.updatePatient(1, { password: "newpass" });
      expect(bcrypt.hash).toHaveBeenCalledWith("newpass", 10);
      expect(result).toEqual({ id: 1 });
    });

    it("raises an error if the patient is not modified", async () => {
      patientRepository.update.mockResolvedValue(null);
      await expect(patientService.updatePatient(1, {})).rejects.toThrow("Patient introuvable ou non modifié");
    });
  });

  // --- DELETE PATIENT ---
  describe("deletePatient", () => {
    it("deletes a patient", async () => {
      patientRepository.delete.mockResolvedValue(true);
      const result = await patientService.deletePatient(1);
      expect(result).toEqual({ message: "Patient supprimé avec succès" });
    });

    it("raises an error if the patient is not found", async () => {
      patientRepository.delete.mockResolvedValue(false);
      await expect(patientService.deletePatient(999)).rejects.toThrow("Patient introuvable");
    });
  });

  // --- GET BY EMAIL ---
  describe("getByEmail", () => {
    it("returns the found patient", async () => {
      patientRepository.findByEmail.mockResolvedValue({ id: 1, email: "test@test.com" });
      const result = await patientService.getByEmail("test@test.com");
      expect(result).toEqual({ id: 1, email: "test@test.com" });
    });

    it("raises an error if email is missing", async () => {
      await expect(patientService.getByEmail("")).rejects.toThrow("Email manquant");
    });

    it("raises an error if the email format is invalid", async () => {
      await expect(patientService.getByEmail("invalid")).rejects.toThrow("Format email non valide");
    });

    it("raises an error if the patient is not found", async () => {
      patientRepository.findByEmail.mockResolvedValue(null);
      await expect(patientService.getByEmail("a@b.com")).rejects.toThrow("Email introuvable");
    });
  });

  // --- LOGIN ---
  describe("login", () => {
    it("returns user and token if successful", async () => {
      const user = { id: 1, email: "a@b.com", password: "hashed" };
      Patient.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("fakeToken");

      const result = await patientService.login("a@b.com", "123");
      expect(result).toEqual({ user, token: "fakeToken" });
    });

    it("raises an error if the user is not found", async () => {
      Patient.findOne.mockResolvedValue(null);
      await expect(patientService.login("a@b.com", "123")).rejects.toThrow("Utilisateur non trouvé");
    });

    it("raises an error if the password is invalid", async () => {
      Patient.findOne.mockResolvedValue({ id: 1, email: "a@b.com", password: "hashed" });
      bcrypt.compare.mockResolvedValue(false);
      await expect(patientService.login("a@b.com", "wrong")).rejects.toThrow("Mot de passe invalide");
    });
  });
});
