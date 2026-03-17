import { render, screen } from '@testing-library/react';
import PlanCard from './PlanCard';
import { describe, it, expect } from 'vitest';

describe('PlanCard', () => {
  const mockPlan = {
    name: 'Home Fiber',
    speed: '300 Mbps',
    price: '99',
    features: ['Unlimited Data', 'Free Installation', 'Wi-Fi 6 Router'],
  };

  it('renders plan details correctly', () => {
    render(<PlanCard plan={mockPlan} />);
    expect(screen.getByText(/Home Fiber/i)).toBeInTheDocument();
    expect(screen.getByText(/300 Mbps/i)).toBeInTheDocument();
    expect(screen.getByText('99')).toBeInTheDocument();
    expect(screen.getByText('$')).toBeInTheDocument();
    expect(screen.getByText(/Unlimited Data/i)).toBeInTheDocument();
  });

  it('shows as recommended when marked', () => {
    render(<PlanCard plan={mockPlan} recommended={true} />);
    expect(screen.getByText(/Recommended/i)).toBeInTheDocument();
  });
});
