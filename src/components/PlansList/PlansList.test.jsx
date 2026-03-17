import { render, screen } from '@testing-library/react';
import PlansList from './PlansList';
import { describe, it, expect } from 'vitest';

describe('PlansList', () => {
  const mockPlans = [
    { id: 1, name: 'Plan A', speed: '100 Mbps', price: '50', features: [] },
    { id: 2, name: 'Plan B', speed: '500 Mbps', price: '100', features: [], recommended: true },
  ];

  it('renders the correct number of plan cards', () => {
    render(<PlansList plans={mockPlans} />);
    expect(screen.getByText(/Plan A/i)).toBeInTheDocument();
    expect(screen.getByText(/Plan B/i)).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /Select Plan/i })).toHaveLength(2);
  });

  it('highlights the recommended plan', () => {
    render(<PlansList plans={mockPlans} />);
    expect(screen.getByText(/Recommended/i)).toBeInTheDocument();
  });
});
