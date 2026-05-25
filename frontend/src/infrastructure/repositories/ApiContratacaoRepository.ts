import { IContratacaoRepository, Plan } from "../../domain/repositories/IContratacaoRepository";
import { Contratacao } from "../../domain/entities/Contratacao";
import { HttpClient } from "../http/HttpClient";

export class ApiContratacaoRepository implements IContratacaoRepository {
  constructor(private readonly httpClient: HttpClient) {}

  public async salvar(
    contratacao: Contratacao,
    token?: string
  ): Promise<{ status: string; cliente_id: number; mensagem: string }> {
    const payload = {
      plano_id: contratacao.getPlanoId(),
      cliente: {
        nome: contratacao.getCliente().getNome(),
        email: contratacao.getCliente().getEmail(),
        documento: contratacao.getCliente().getDocumento(),
        documento_url: contratacao.getCliente().getDocumentoUrl(),
      },
    };

    const headers: HeadersInit = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    return await this.httpClient.request<{ status: string; cliente_id: number; mensagem: string }>(
      "/contratacao/",
      {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      }
    );
  }

  public async buscarPlanos(): Promise<Plan[]> {
    return await this.httpClient.request<Plan[]>("/planos/", {
      method: "GET",
    });
  }
}
