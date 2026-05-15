import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import PlansGrid from '../src/app/PlansGrid'

// Mock fetch
global.fetch = vi.fn()

describe('PlansGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve buscar e renderizar os planos da API', async () => {
    const mockPlans = [
      { id: 1, nome: 'Plano Básico', preco: 50, velocidade_mbps: 100 },
      { id: 2, nome: 'Plano Pro', preco: 100, velocidade_mbps: 300 }
    ]
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPlans
    })

    const jsx = await PlansGrid()
    render(jsx)

    expect(screen.getByText('Plano Básico')).toBeInTheDocument()
    expect(screen.getByText('Plano Pro')).toBeInTheDocument()
    // Plano 2 (índice 1) deve ser featured
    const article = screen.getByText('Plano Pro').closest('article')
    expect(article).toHaveClass('featured')
  })

  it('deve renderizar planos de fallback caso a API falhe', async () => {
    ;(fetch as any).mockRejectedValueOnce(new Error('Network error'))

    const jsx = await PlansGrid()
    render(jsx)

    // Planos de fallback hardcoded no PlansGrid
    expect(screen.getByText('Essencial 100')).toBeInTheDocument()
    expect(screen.getByText('Turbo 300')).toBeInTheDocument()
    expect(screen.getByText('Ultra 600')).toBeInTheDocument()
  })
})
