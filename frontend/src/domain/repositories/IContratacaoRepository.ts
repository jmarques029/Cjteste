import { Contratacao } from "../entities/Contratacao";

export interface Plan {
  id: number;
  nome: string;
  preco: number;
  velocidade_mbps: number;
}

export interface IContratacaoRepository {
  salvar(contratacao: Contratacao, token?: string): Promise<{ status: string; cliente_id: number; mensagem: string }>;
  buscarPlanos(): Promise<Plan[]>;
}
