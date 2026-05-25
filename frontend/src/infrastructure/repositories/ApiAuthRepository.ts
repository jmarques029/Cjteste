import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { HttpClient } from "../http/HttpClient";

export class ApiAuthRepository implements IAuthRepository {
  constructor(private readonly httpClient: HttpClient) {}

  public async login(username: string, password: string): Promise<{ access_token: string }> {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    return await this.httpClient.postForm<{ access_token: string }>(
      "/auth/token",
      params
    );
  }
}
