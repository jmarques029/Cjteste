import { User } from '../../domain/entities/user';
import { UserRepository } from '../../domain/repositories/user-repository';

export class GetUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(id: string): Promise<User> {
    if (!id) {
      throw new Error('User ID is required');
    }
    return this.userRepository.getUserById(id);
  }
}
