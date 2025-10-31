/**
* Generic class: BaseRepository
*
* This repository serves as the **base class for all database interactions**.
* It provides reusable CRUD (Create, Read, Update, Delete) methods for any Sequelize model.
*
* Goal:
* - Centralize basic data operations (access, update, delete, etc.).
* - Avoid code duplication between different specific repositories (UserRepository, ProRepository, etc.).
*
*
* Advantage:
* Each repository inherits ready-to-use generic methods,
* while being able to add specific methods if needed.
*/
export default class BaseRepository {
  constructor(model) {
    // We inject a "model" (e.g. User, Pro...) from Sequelize
    // This allows the class to be reusable for any table
    this.model = model;
  }

  async create(data) {
    // Creates a new record in the table using the provided data
    return await this.model.create(data);
  }

  async findById(id, options = {}) {
    // Retrieves a record by searching using the primary key (id)
    // `options` allows passing Sequelize parameters (e.g.: include, attributes...)
    return await this.model.findByPk(id, options);
  }

  async findAll(options = {}) {
    // Retrieve all records from the table
    return await this.model.findAll(options);
  }

  async findOne(where = {}) {
    // Find a single record that matches a given condition
    // `where` is a Sequelize object (e.g.: { email: "test@test.com" })
    return await this.model.findOne({where});
  }

  async update(id, data) {
    // Updates a record identified by its ID
    // The record is retrieved using its primary key
    // If no record is found, null is returned
    // Only this specific record is updated with the new data
    const instance = await this.model.findByPk(id);
    if (!instance) return null;
    return await instance.update(data);
  }

  async delete(id) {
    // Deletes a record identified by its ID
    // The record is retrieved using its primary key
    // If no record is found, null is returned
    // Only this specific record is deleted
    const instance = await this.model.findByPk(id);
    if (!instance) return null;
    return await instance.destroy();
  }
}
