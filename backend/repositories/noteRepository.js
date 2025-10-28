import BaseRepository from "./baseRepository";
import { Teleconsultation, Note } from "../models/relationModel.js";

export default class NoteRepository extends BaseRepository{
  constructor() {
    super(Note);
  }

  // Create a note
  async createNote(teleconsultationId, description) {
    const note = await Note.create({
      teleconsultationId,
      description
    });
    return note;
  }

  // Retrieve the note
  async getNote(noteId) {

  }
}