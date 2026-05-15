import { User } from '../../domain/entities/user';
import { UserRepository } from '../../domain/repositories/user-repository';

export class UserRepositoryImpl implements UserRepository {
  async getUserById(id: string): Promise<User> {
    // Simulando uma chamada HTTP
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id,
          name: 'John Doe',
          email: 'john.doe@example.com'
        });
      }, 500);
    });
  }
}
