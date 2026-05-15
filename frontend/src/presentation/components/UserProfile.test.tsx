import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { UserProfile } from './UserProfile';
import * as hook from '../hooks/use-user';

describe('UserProfile Component', () => {
  it('should render loading state initially', () => {
    vi.spyOn(hook, 'useUser').mockReturnValue({ user: null, loading: true, error: null });
    
    render(<UserProfile userId="1" />);
    
    expect(screen.getByText('Carregando usuário...')).toBeInTheDocument();
  });

  it('should render user data when loaded', () => {
    const mockUser = { id: '123', name: 'John Doe', email: 'john@example.com' };
    vi.spyOn(hook, 'useUser').mockReturnValue({ user: mockUser, loading: false, error: null });
    
    render(<UserProfile userId="123" />);
    
    expect(screen.getByText('Perfil do Usuário')).toBeInTheDocument();
    expect(screen.getByText('Nome: John Doe')).toBeInTheDocument();
  });
});
