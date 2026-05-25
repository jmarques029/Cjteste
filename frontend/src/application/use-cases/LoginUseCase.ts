import { IAuthRepository } from "../../domain/repositories/IAuthRepository";

export interface LoginInput {
  username: string;
  password: string;
}

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  public async execute(input: LoginInput): Promise<{ access_token: string }> {
    if (!input.username || input.username.trim() === "") {
      throw new Error("O nome de usuário é obrigatório.");
    }
    if (!input.password || input.password === "") {
      throw new Error("A senha é obrigatória.");
    }

    return await this.authRepository.login(input.username, input.password);
  }
}
