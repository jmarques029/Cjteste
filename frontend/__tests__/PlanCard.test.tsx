import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PlanCard from '../src/app/PlanCard'

const mockPlan = {
  id: 1,
  nome: 'Plano Teste',
  preco: 99.9,
  velocidade_mbps: 200,
}

describe('PlanCard', () => {
  it('deve renderizar os dados do plano corretamente', () => {
    render(<PlanCard plan={mockPlan} />)
    
    expect(screen.getByText('Plano Teste')).toBeInTheDocument()
    expect(screen.getByText('99')).toBeInTheDocument()
    expect(screen.getByText(',90')).toBeInTheDocument()
    expect(screen.getByText('200 Mbps')).toBeInTheDocument()
  })

  it('deve exibir badge de Mais Vendido para velocidades acima de 200 Mbps', () => {
    render(<PlanCard plan={mockPlan} />)
    expect(screen.getByText('🚀 Mais Vendido')).toBeInTheDocument()
  })

  it('deve exibir badge de Alta Performance para velocidades acima de 500 Mbps', () => {
    render(<PlanCard plan={{ ...mockPlan, velocidade_mbps: 600 }} />)
    expect(screen.getByText('⚡ Alta Performance')).toBeInTheDocument()
  })

  it('deve formatar velocidades em Gbps corretamente', () => {
    render(<PlanCard plan={{ ...mockPlan, velocidade_mbps: 1000 }} />)
    expect(screen.getByText('1 Gbps')).toBeInTheDocument()
  })

  it('deve aplicar a classe featured quando a propriedade featured for true', () => {
    const { container } = render(<PlanCard plan={mockPlan} featured={true} />)
    expect(container.firstChild).toHaveClass('featured')
    expect(screen.getByRole('link', { name: /Contratar plano Plano Teste/i })).toHaveTextContent('Contratar Agora')
  })
})
