/**
 * BaseRepository
 *
 * - Provides a generic repository layer for Sequelize models.
 * - Encapsulates common database operations (CRUD).
 * - Can be extended or reused for different entities (e.g., Patient, User).
 *
 * Responsibilities:
 * - Create new records
 * - Retrieve records (by ID, all, or with conditions)
 * - Update existing records
 * - Delete records
 *
 * Notes:
 * - This abstraction keeps controllers/services cleaner by centralizing DB logic.
 * - Each method uses async/await with Sequelize.
 * - If a record is not found in `update` or `delete`, the method returns null.
 */

export default class BaseRepository {
  constructor(model) {
		// Inject a Sequelize model (e.g., Patient, User)
    // Makes this repository reusable across multiple entities
		this.model = model;
	}

	async create(data) {
		// Creates a new record in the table using the provided data
		return await this.model.create(data);
	}

	async findById(id, options = {}) {
		// Retrieves a record by primary key
    // `options` can include Sequelize parameters (e.g., attributes, include)
		return await this.model.findByPk(id, options);
	}

	async findAll(options = {}) {
		// Retrieve all records from the table
		return await this.model.findAll(options);
	}

	async findOne(where = {}) {
		// Find a single record that matches given conditions
		// Example: { email: "test@test.com" }
		return await this.model.findOne({where});
	}

	async update(id, data) {
		// Updates a record identified by its primary key
		const instance = await this.model.findByPk(id);
		if (!instance) return null; // No record found

		await instance.update(data); // Apply updates
		return await instance.reload(); // Reload to get fresh values
	}

	async delete(id) {
		// Deletes a record identified by its primary key
		const instance = await this.model.findByPk(id);
		if (!instance) return null; // No record found

		return await instance.destroy(); // Permanently delete the record
	}
}
