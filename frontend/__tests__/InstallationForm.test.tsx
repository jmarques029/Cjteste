import { screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import InstallationForm from "../src/app/InstallationForm";
import { renderWithProviders } from "./utils/custom-render";

// Mock UploadField
vi.mock("../src/app/components/UploadField", () => {
  return {
    default: ({ onUploadSuccess }: { onUploadSuccess: (path: string) => void }) => (
      <div data-testid="upload-field-mock">
        <button type="button" onClick={() => onUploadSuccess("mock/path.pdf")}>
          Upload
        </button>
      </div>
    ),
  };
});

// Mock global fetch
global.fetch = vi.fn();

describe("InstallationForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    window.location.hash = "";

    // Configura o fetch mock de forma inteligente baseada na URL
    (fetch as any).mockImplementation((url: string, options?: any) => {
      if (url.includes("/planos/")) {
        return Promise.resolve({
          ok: true,
          json: async () => [{ id: 1, nome: "Plano Básico", velocidade_mbps: 100, preco: 79.9 }],
        });
      }
      if (url.includes("/auth/token")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ access_token: "fake-token" }),
        });
      }
      if (url.includes("/contratacao/")) {
        return Promise.resolve({
          ok: true,
          json: async () => ({ status: "success", cliente_id: 1, mensagem: "Sucesso" }),
        });
      }
      return Promise.reject(new Error("URL não mockada"));
    });
  });

  it("deve renderizar o formulário de login se o usuário não estiver logado", async () => {
    renderWithProviders(<InstallationForm />);

    expect(await screen.findByRole("heading", { name: /Faça login para contratar/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Usuário/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
  });

  it("deve renderizar o formulário de contratação se o usuário estiver logado", async () => {
    localStorage.setItem("token", "fake-token");
    renderWithProviders(<InstallationForm />);

    expect(await screen.findByRole("heading", { name: /Solicitar Instalação/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Nome completo/i)).toBeInTheDocument();
  });

  it("deve realizar login e exibir o formulário de contratação", async () => {
    renderWithProviders(<InstallationForm />);

    const userInput = await screen.findByLabelText(/Usuário/i);
    const passInput = screen.getByLabelText(/Senha/i);
    const submitBtn = screen.getByRole("button", { name: /Entrar e Continuar/i });

    fireEvent.change(userInput, { target: { value: "admin" } });
    fireEvent.change(passInput, { target: { value: "123" } });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /Solicitar Instalação/i })).toBeInTheDocument();
    });
  });

  it("deve enviar o formulário de contratação com sucesso", async () => {
    localStorage.setItem("token", "fake-token");

    renderWithProviders(<InstallationForm />);

    // Espera renderizar os planos no select
    await screen.findByText(/Plano Básico/);

    // Preencher formulário (usando CPF válido para passar na validação de Domínio)
    fireEvent.change(screen.getByLabelText(/Nome completo/i), { target: { value: "João Silva" } });
    fireEvent.change(screen.getByLabelText(/E-mail/i), { target: { value: "joao@email.com" } });
    fireEvent.change(screen.getByLabelText(/CPF/i), { target: { value: "12345678909" } });
    fireEvent.change(screen.getByLabelText(/Plano de interesse/i), { target: { value: "1" } });

    // Simular upload
    fireEvent.click(screen.getByText("Upload"));

    // Submeter formulário
    const submitBtn = screen.getByRole("button", { name: /Solicitar Instalação/i });

    await waitFor(() => {
      expect(submitBtn).not.toBeDisabled();
    });

    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Contratação enviada!/i)).toBeInTheDocument();
    });

    // Verificar body do request de contratação
    const calls = (fetch as any).mock.calls;
    const req = calls.find((c: any) => c[0].includes("/contratacao/"));
    expect(req).toBeDefined();

    const body = JSON.parse(req[1].body);
    expect(body).toEqual({
      plano_id: 1,
      cliente: {
        nome: "João Silva",
        email: "joao@email.com",
        documento: "123.456.789-09", // formatado pelo Value Object do domínio
        documento_url: "mock/path.pdf",
      },
    });
  });
});
