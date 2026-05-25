import { describe, it, expect, vi } from "vitest";
import { Nome } from "../../src/domain/value-objects/Nome";
import { Email } from "../../src/domain/value-objects/Email";
import { Documento } from "../../src/domain/value-objects/Documento";
import { Cliente } from "../../src/domain/entities/Cliente";
import { Contratacao } from "../../src/domain/entities/Contratacao";
import {
  InvalidNomeError,
  InvalidEmailError,
  InvalidDocumentoError,
  InvalidPlanoError,
} from "../../src/domain/errors/DomainError";
import { SolicitarContratacaoUseCase } from "../../src/application/use-cases/SolicitarContratacaoUseCase";
import { LoginUseCase } from "../../src/application/use-cases/LoginUseCase";
import { IContratacaoRepository } from "../../src/domain/repositories/IContratacaoRepository";
import { IAuthRepository } from "../../src/domain/repositories/IAuthRepository";

describe("Domain - Value Objects", () => {
  describe("Nome", () => {
    it("deve criar um Nome válido", () => {
      const nome = Nome.create("Ana");
      expect(nome.getValue()).toBe("Ana");
    });

    it("deve lançar erro se o nome for menor que 3 caracteres", () => {
      expect(() => Nome.create("Jo")).toThrow(InvalidNomeError);
      expect(() => Nome.create("  ")).toThrow(InvalidNomeError);
    });
  });

  describe("Email", () => {
    it("deve criar um Email válido", () => {
      const email = Email.create("contato@cjnet.com.br");
      expect(email.getValue()).toBe("contato@cjnet.com.br");
    });

    it("deve lançar erro se o email for inválido", () => {
      expect(() => Email.create("email-sem-arroba.com")).toThrow(InvalidEmailError);
      expect(() => Email.create("contato@")).toThrow(InvalidEmailError);
    });
  });

  describe("Documento (CPF / CNPJ)", () => {
    it("deve aceitar e formatar um CPF válido", () => {
      // CPF válido gerado por algoritmo padrão
      const doc = Documento.create("12345678909");
      expect(doc.getValue()).toBe("123.456.789-09");
    });

    it("deve aceitar e formatar um CNPJ válido", () => {
      // CNPJ válido fictício com formato de dígitos válidos
      const doc = Documento.create("11222333000181");
      expect(doc.getValue()).toBe("11.222.333/0001-81");
    });

    it("deve rejeitar CPF ou CNPJ com dígitos verificadores inválidos", () => {
      expect(() => Documento.create("11111111111")).toThrow(InvalidDocumentoError);
      expect(() => Documento.create("12345678900")).toThrow(InvalidDocumentoError);
    });
  });
});

describe("Domain - Entidades", () => {
  it("deve criar uma entidade Cliente válida", () => {
    const cliente = Cliente.create({
      nome: "João da Silva",
      email: "joao@gmail.com",
      documento: "12345678909",
      documentoUrl: "uploads/id.pdf",
    });

    expect(cliente.getNome()).toBe("João da Silva");
    expect(cliente.getEmail()).toBe("joao@gmail.com");
    expect(cliente.getDocumento()).toBe("123.456.789-09");
    expect(cliente.getDocumentoUrl()).toBe("uploads/id.pdf");
  });

  it("deve criar uma entidade Contratacao vinculando o Cliente e o Plano", () => {
    const cliente = Cliente.create({
      nome: "João da Silva",
      email: "joao@gmail.com",
      documento: "12345678909",
    });

    const contratacao = Contratacao.create({
      planoId: 2,
      cliente,
    });

    expect(contratacao.getPlanoId()).toBe(2);
    expect(contratacao.getCliente()).toBe(cliente);
  });

  it("deve falhar se o id do plano for inválido", () => {
    const cliente = Cliente.create({
      nome: "João da Silva",
      email: "joao@gmail.com",
      documento: "12345678909",
    });

    expect(() => Contratacao.create({ planoId: 0, cliente })).toThrow(InvalidPlanoError);
  });
});

describe("Application - Casos de Uso", () => {
  const mockRepository: IContratacaoRepository = {
    salvar: vi.fn().mockResolvedValue({ status: "success", cliente_id: 1, mensagem: "Contratado com sucesso!" }),
    buscarPlanos: vi.fn(),
  };

  const mockAuthRepository: IAuthRepository = {
    login: vi.fn().mockResolvedValue({ access_token: "fake-jwt-token" }),
  };

  describe("SolicitarContratacaoUseCase", () => {
    it("deve executar com sucesso o fluxo de contratação", async () => {
      const useCase = new SolicitarContratacaoUseCase(mockRepository);

      const resultado = await useCase.execute({
        planoId: 2,
        nome: "Carlos Silva",
        email: "carlos@gmail.com",
        documento: "12345678909",
        documentoUrl: "uploads/doc.jpg",
        token: "user-jwt",
      });

      expect(resultado.status).toBe("success");
      expect(mockRepository.salvar).toHaveBeenCalled();
    });

    it("deve falhar prematuramente (Fail-Fast) se o email for inválido sem chamar o repositório", async () => {
      const useCase = new SolicitarContratacaoUseCase(mockRepository);
      vi.clearAllMocks();

      await expect(
        useCase.execute({
          planoId: 2,
          nome: "Carlos Silva",
          email: "email-invalido",
          documento: "12345678909",
        })
      ).rejects.toThrow(InvalidEmailError);

      expect(mockRepository.salvar).not.toHaveBeenCalled();
    });
  });

  describe("LoginUseCase", () => {
    it("deve realizar login e retornar o token", async () => {
      const useCase = new LoginUseCase(mockAuthRepository);

      const res = await useCase.execute({ username: "admin", password: "123" });
      expect(res.access_token).toBe("fake-jwt-token");
      expect(mockAuthRepository.login).toHaveBeenCalledWith("admin", "123");
    });

    it("deve lançar erro se usuário ou senha estiverem vazios", async () => {
      const useCase = new LoginUseCase(mockAuthRepository);

      await expect(useCase.execute({ username: "", password: "123" })).rejects.toThrow(
        "O nome de usuário é obrigatório."
      );
      await expect(useCase.execute({ username: "admin", password: "" })).rejects.toThrow(
        "A senha é obrigatória."
      );
    });
  });
});
