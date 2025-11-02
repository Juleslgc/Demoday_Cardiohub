import noteService from "../../services/noteService.js";
import noteRepository from "../../repositories/noteRepository.js";
import { Appointment } from "../../models/relationModel.js";
/**
* UNIT TESTS — NoteService
*
* This file contains the unit tests for the `NoteService`. 
* It verifies the correct functioning of operations related to notes associated with appointments,
* using the **Jest** framework. These tests ensure the reliability of the business logic
* without depending on a real database. 
*
* Objectives:
* - Guarantee that the creation, retrieval, and updating of notes work correctly. 
* - Verify error handling (missing description, already existing note, non-existent appointment, etc.). 
* - Simulate interactions with the repositories (`noteRepository`) and models (`Appointment`) using `jest.mock`. 
*
* Modules tested:
* 1. **createNote** → Creates a note for an existing appointment, with data validation and uniqueness check. 
* 2. **getNoteByAppointment** → Retrieves the note associated with a specific appointment. 
* 3. **updateNote** → Updates the content of an existing note. 
*
* Tools and techniques:
* - `jest.mock()`: simulates external dependencies (repository and model). 
* - `jest.clearAllMocks()`: resets the mocks before each test. 
* - `expect(...).toThrow()`: verifies the correct throwing of errors. 
* - `expect(...).toHaveBeenCalledWith()`: ensures that methods are called with the correct parameters. 
*
* In summary:
* These tests validate the behavior of the note management service,
* ensuring that it applies the business rules and interacts correctly with other layers. 
*/

// Mock methods
jest.mock("../../repositories/noteRepository.js");
jest.mock("../../models/relationModel.js");

describe("NoteService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // --- CREATE NOTE ---
  describe("createNote", () => {
    it("should create a note if everything is correct.", async () => {
      const appointmentId = "uuid-123";
      const description = "Test note";

      // Mock Appointment.findByPk
      Appointment.findByPk = jest.fn().mockResolvedValue({ id: appointmentId });

      // Mock getNoteByAppointment -> no existing note
      noteRepository.getNoteByAppointment.mockResolvedValue(null);

      // Mock createNote
      noteRepository.createNote.mockResolvedValue({ id: "note-1", appointmentId, description });

      const note = await noteService.createNote(appointmentId, {description});

      expect(Appointment.findByPk).toHaveBeenCalledWith(appointmentId);
      expect(noteRepository.getNoteByAppointment).toHaveBeenCalledWith(appointmentId);
      expect(noteRepository.createNote).toHaveBeenCalledWith(appointmentId, {description});
      expect(note).toEqual({ id: "note-1", appointmentId, description });
    });

    it("should fail if the appointment does not exist.", async () => {
      Appointment.findByPk = jest.fn().mockResolvedValue(null);
      await expect(noteService.createNote("uuid-123", { description: "desc" })).rejects.toThrow("Rendez-vous non trouvé");
    });

    it("should fail if the description is missing", async () => {
      Appointment.findByPk = jest.fn().mockResolvedValue({ id: "uuid-123" });
      await expect(noteService.createNote("uuid-123", { description: "" })).rejects.toThrow("Description manquante");
    });

    it("should fail if a note already exists", async () => {
      Appointment.findByPk = jest.fn().mockResolvedValue({ id: "uuid-123" });
      noteRepository.getNoteByAppointment.mockResolvedValue({ id: "note-1" });

      await expect(noteService.createNote("uuid-123", { description: "desc" })).rejects.toThrow("Une note existe déjà pour ce rendez-vous");
    });
  });

  // --- RETRIEVE NOTE ---
  describe("getNoteByAppointment", () => {
    it("should return the existing note", async () => {
      noteRepository.getNoteByAppointment.mockResolvedValue({ id: "note-1", appointmentId: "uuid-123", description: "Test" });

      const note = await noteService.getNoteByAppointment("uuid-123");
      expect(noteRepository.getNoteByAppointment).toHaveBeenCalledWith("uuid-123");
      expect(note.id).toBe("note-1");
    });

    it("should fail if no grade", async () => {
      noteRepository.getNoteByAppointment.mockResolvedValue(null);

      await expect(noteService.getNoteByAppointment("uuid-123")).rejects.toThrow("Note pour cette téléconsultation non trouvée");
    });
  });

  // --- UPDATE NOTE ---
  describe("updateNote", () => {
    it("The note should be updated if the description is valid.", async () => {
      const updatedNote = { id: "note-1", description: "nouvelle desc" };
      noteRepository.updateNote.mockResolvedValue(updatedNote);

      const note = await noteService.updateNote("note-1", { description: "nouvelle desc" });
      expect(noteRepository.updateNote).toHaveBeenCalledWith("note-1", { description: "nouvelle desc" });
      expect(note.description).toBe("nouvelle desc");
    });

    it("should fail if description is missing", async () => {
      await expect(noteService.updateNote("note-1", { description: "" })).rejects.toThrow("Description manquante");
    });

    it("should fail if the grade is not found", async () => {
      noteRepository.updateNote.mockResolvedValue(null);
      await expect(noteService.updateNote("note-1", { description: "desc" })).rejects.toThrow("Note non trouvé");
    });
  });
});
