import { Cliente } from "../../domain/entities/Cliente";
import { Contratacao } from "../../domain/entities/Contratacao";
import { IContratacaoRepository } from "../../domain/repositories/IContratacaoRepository";

export interface SolicitarContratacaoInput {
  planoId: number;
  nome: string;
  email: string;
  documento: string;
  documentoUrl?: string | null;
  token?: string;
}

export class SolicitarContratacaoUseCase {
  constructor(private readonly repository: IContratacaoRepository) {}

  public async execute(input: SolicitarContratacaoInput) {
    // Validação e construção precoce dos objetos de domínio (Fail-Fast)
    const cliente = Cliente.create({
      nome: input.nome,
      email: input.email,
      documento: input.documento,
      documentoUrl: input.documentoUrl,
    });

    const contratacao = Contratacao.create({
      planoId: input.planoId,
      cliente,
    });

    // Inversão de dependência: persiste delegando para a interface pura do domínio
    const resultado = await this.repository.salvar(contratacao, input.token);
    return resultado;
  }
}
