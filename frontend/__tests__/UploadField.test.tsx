import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import UploadField from '../src/app/components/UploadField'

// Mock global fetch
global.fetch = vi.fn()

describe('UploadField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve permitir selecionar um arquivo e chamar a API de upload', async () => {
    const mockResponse = { info: "Arquivo 'documento.pdf' salvo com sucesso.", path: "uploads/documento.pdf" }
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const onUploadSuccess = vi.fn()
    render(<UploadField onUploadSuccess={onUploadSuccess} />)

    const file = new File(['hello'], 'documento.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/documento de identificação/i) as HTMLInputElement
    
    // Simular a seleção do arquivo
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      // Verificar se o fetch foi chamado com FormData
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/upload/'), expect.objectContaining({
        method: 'POST',
        body: expect.any(FormData)
      }))
      
      // Verificar se o callback foi chamado com o path retornado
      expect(onUploadSuccess).toHaveBeenCalledWith("uploads/documento.pdf")
      
      // Verificar feedback visual de sucesso
      expect(screen.getByText(/upload concluído/i)).toBeInTheDocument()
    })
  })

  it('deve exibir erro se o upload falhar', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    render(<UploadField onUploadSuccess={() => {}} />)

    const file = new File(['hello'], 'error.pdf', { type: 'application/pdf' })
    const input = screen.getByLabelText(/documento de identificação/i)
    
    fireEvent.change(input, { target: { files: [file] } })

    await waitFor(() => {
      expect(screen.getByText(/falha no upload/i)).toBeInTheDocument()
    })
  })
})
