import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import LoginModal from '../src/app/components/LoginModal'

// Mock global fetch
global.fetch = vi.fn()

describe('LoginModal', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
  })

  it('deve renderizar os campos de login corretamente', () => {
    render(<LoginModal isOpen={true} onClose={() => {}} />)
    
    expect(screen.getByLabelText(/usuário/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument()
  })

  it('deve chamar a API de login e salvar o token no sucesso', async () => {
    const mockToken = { access_token: 'fake-jwt-token', token_type: 'bearer' }
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockToken,
    })

    const onClose = vi.fn()
    render(<LoginModal isOpen={true} onClose={onClose} />)

    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'admin' } })
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/auth/token'), expect.any(Object))
      expect(localStorage.getItem('token')).toBe('fake-jwt-token')
      expect(onClose).toHaveBeenCalled()
    })
  })

  it('deve exibir mensagem de erro quando o login falha', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ detail: 'Incorrect username or password' }),
    })

    render(<LoginModal isOpen={true} onClose={() => {}} />)

    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'admin' } })
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'wrongpass' } })
    fireEvent.click(screen.getByRole('button', { name: /entrar/i }))

    await waitFor(() => {
      expect(screen.getByText(/incorrect username or password/i)).toBeInTheDocument()
      expect(localStorage.getItem('token')).toBeNull()
    })
  })
})
