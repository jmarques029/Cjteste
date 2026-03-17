import { render, screen, fireEvent } from '@testing-library/react';
import LeadForm from './LeadForm';
import { describe, it, expect, vi } from 'vitest';

describe('LeadForm', () => {
  it('renders correctly', () => {
    render(<LeadForm />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Get Started/i })).toBeInTheDocument();
  });

  it('shows error messages on empty submission', async () => {
    render(<LeadForm />);
    fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));
    
    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Email is required/i)).toBeInTheDocument();
  });

  it('calls onSubmit with valid data', async () => {
    const handleSubmit = vi.fn();
    render(<LeadForm onSubmit={handleSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Get Started/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com'
    });
  });
});
