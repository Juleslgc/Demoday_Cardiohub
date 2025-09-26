import { BaseRepository} from './baseRepository';

export default class UserRepository extends BaseRepository {
  constructor() {
		super(User);
	}

	async findByEmail(email) {
		return await this.findOne({where: email});
	}
}
