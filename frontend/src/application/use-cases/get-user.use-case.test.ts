import { describe, it, expect, vi } from 'vitest';
import { GetUserUseCase } from './get-user.use-case';
import { UserRepository } from '../../domain/repositories/user-repository';

describe('GetUserUseCase', () => {
  it('should fetch user by id', async () => {
    const mockUser = { id: '1', name: 'Test', email: 'test@test.com' };
    const mockRepository: UserRepository = {
      getUserById: vi.fn().mockResolvedValue(mockUser)
    };

    const useCase = new GetUserUseCase(mockRepository);
    const user = await useCase.execute('1');

    expect(user).toEqual(mockUser);
    expect(mockRepository.getUserById).toHaveBeenCalledWith('1');
  });

  it('should throw an error if id is not provided', async () => {
    const mockRepository: UserRepository = {
      getUserById: vi.fn()
    };
    
    const useCase = new GetUserUseCase(mockRepository);
    
    await expect(useCase.execute('')).rejects.toThrow('User ID is required');
  });
});
