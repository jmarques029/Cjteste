import { render, screen, fireEvent } from '@testing-library/react';
import InstallationForm from './InstallationForm';
import { describe, it, expect, vi } from 'vitest';

describe('InstallationForm', () => {
  it('renders all required fields', () => {
    render(<InstallationForm />);
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Complete Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone Number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Select Plan/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Submit Request/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<InstallationForm />);
    fireEvent.click(screen.getByRole('button', { name: /Submit Request/i }));
    
    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Address is required/i)).toBeInTheDocument();
    expect(await screen.findByText(/Phone is required/i)).toBeInTheDocument();
  });

  it('submits correctly with valid data', async () => {
    const handleSubmit = vi.fn();
    render(<InstallationForm onSubmit={handleSubmit} />);
    
    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Jane Doe' } });
    fireEvent.change(screen.getByLabelText(/Complete Address/i), { target: { value: '123 Fiber St' } });
    fireEvent.change(screen.getByLabelText(/Phone Number/i), { target: { value: '555-0199' } });
    fireEvent.change(screen.getByLabelText(/Select Plan/i), { target: { value: 'Giga Fiber' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Submit Request/i }));
    
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'Jane Doe',
      address: '123 Fiber St',
      phone: '555-0199',
      plan: 'Giga Fiber'
    });
  });
});
