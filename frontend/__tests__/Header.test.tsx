import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Header from '../src/app/components/Header'

// Mock LoginModal para isolar o teste do Header
vi.mock('../src/app/components/LoginModal', () => {
  return {
    default: ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => (
      isOpen ? <div data-testid="login-modal-mock"><button onClick={onClose}>Close Modal</button></div> : null
    )
  }
})

describe('Header', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    // Reset window.location.reload
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: vi.fn() },
    })
  })

  it('deve renderizar os links de navegação corretamente', () => {
    render(<Header />)
    
    expect(screen.getByRole('link', { name: /CJnet — Página inicial/i })).toBeInTheDocument()
    expect(screen.getByText('Vantagens')).toBeInTheDocument()
    expect(screen.getByText('Planos')).toBeInTheDocument()
    expect(screen.getByText('Contratar')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Área do Cliente/i })).toBeInTheDocument()
  })

  it('deve exibir botão Sair quando o usuário estiver logado', () => {
    localStorage.setItem('token', 'fake-token')
    render(<Header />)
    
    expect(screen.getByRole('button', { name: /Sair/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Área do Cliente/i })).not.toBeInTheDocument()
  })

  it('deve abrir o modal de login ao clicar em Área do Cliente', () => {
    render(<Header />)
    
    fireEvent.click(screen.getByRole('button', { name: /Área do Cliente/i }))
    expect(screen.getByTestId('login-modal-mock')).toBeInTheDocument()
    
    // Fechar modal
    fireEvent.click(screen.getByText('Close Modal'))
    expect(screen.queryByTestId('login-modal-mock')).not.toBeInTheDocument()
  })

  it('deve remover token e recarregar a página ao clicar em Sair', () => {
    localStorage.setItem('token', 'fake-token')
    render(<Header />)
    
    fireEvent.click(screen.getByRole('button', { name: /Sair/i }))
    
    expect(localStorage.getItem('token')).toBeNull()
    expect(window.location.reload).toHaveBeenCalled()
  })
})
