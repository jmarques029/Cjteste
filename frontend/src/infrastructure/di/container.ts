import { HttpClient } from "../http/HttpClient";
import { ApiContratacaoRepository } from "../repositories/ApiContratacaoRepository";
import { ApiAuthRepository } from "../repositories/ApiAuthRepository";
import { SolicitarContratacaoUseCase } from "../../application/use-cases/SolicitarContratacaoUseCase";
import { LoginUseCase } from "../../application/use-cases/LoginUseCase";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Instâncias de Infraestrutura
const httpClient = new HttpClient(API_URL);
const contratacaoRepository = new ApiContratacaoRepository(httpClient);
const authRepository = new ApiAuthRepository(httpClient);

// Instâncias de Casos de Uso com dependências injetadas (Dependency Inversion)
const solicitarContratacaoUseCase = new SolicitarContratacaoUseCase(contratacaoRepository);
const loginUseCase = new LoginUseCase(authRepository);

export {
  contratacaoRepository,
  authRepository,
  solicitarContratacaoUseCase,
  loginUseCase,
  API_URL
};
