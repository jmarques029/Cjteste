export interface IAuthRepository {
  login(username: string, password: string): Promise<{ access_token: string }>;
}
