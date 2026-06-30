import { screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PlansGrid from "../src/app/PlansGrid";
import { renderWithProviders } from "./utils/custom-render";

// Mock global fetch
global.fetch = vi.fn();

describe("PlansGrid", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("deve buscar e renderizar os planos da API", async () => {
    const mockPlans = [
      { id: 1, nome: "Plano Básico", preco: 50.0, velocidade_mbps: 100 },
      { id: 2, nome: "Plano Pro", preco: 100.0, velocidade_mbps: 300 },
    ];
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlans,
    });

    renderWithProviders(<PlansGrid />);

    // Deve esperar o carregamento e renderização dos planos mockados
    await waitFor(() => {
      expect(screen.getByText("Plano Básico")).toBeInTheDocument();
      expect(screen.getByText("Plano Pro")).toBeInTheDocument();
    });

    // Plano Pro (índice 1) deve ser featured
    const article = screen.getByText("Plano Pro").closest("article");
    expect(article).toHaveClass("featured");
  });

  it("deve exibir mensagem de erro quando a API falha", async () => {
    (fetch as any).mockRejectedValueOnce(new Error("Network error"));

    renderWithProviders(<PlansGrid />);

    await waitFor(() => {
      expect(screen.getByText("Nenhum plano disponível no momento.")).toBeInTheDocument();
    });
  });

  it("deve permitir tentar novamente quando a API falha", async () => {
    (fetch as any)
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [{ id: 1, nome: "Plano Recuperado", preco: 80.0, velocidade_mbps: 200 }],
      });

    renderWithProviders(<PlansGrid />);

    // Wait for error view
    await waitFor(() => {
      expect(screen.getByText("Nenhum plano disponível no momento.")).toBeInTheDocument();
    });

    const retryButton = screen.getByRole("button", { name: /Tentar Novamente/i });
    expect(retryButton).toBeInTheDocument();

    // Click retry
    retryButton.click();

    // Wait for refetch
    await waitFor(() => {
      expect(screen.getByText("Plano Recuperado")).toBeInTheDocument();
    });
  });
});
