import { GetUserUseCase } from '../../application/use-cases/get-user.use-case';
import { UserRepositoryImpl } from '../repositories/user-repository-impl';

// Simple Service Locator / Factory
export const di = {
  getUserUseCase: () => {
    const userRepository = new UserRepositoryImpl();
    return new GetUserUseCase(userRepository);
  }
};
