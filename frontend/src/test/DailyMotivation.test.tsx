import { describe, it, expect, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { DailyMotivation } from '../../components/DailyMotivation';

describe('DailyMotivation Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders a random tip when tips are loaded', () => {
    render(<DailyMotivation />);
    
    // Day counter should start at 0 if first visit
    const header = screen.getByText(/Day \d+ of Your Carbon Journey/i);
    expect(header).toBeInTheDocument();

    // Check if one of the static tips is rendered
    const link = screen.getByText(/Learn More/i);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href');
  });

  it('correctly increments day counter across visits', () => {
    localStorage.setItem('dailyMotivationDay', '5');
    localStorage.setItem('dailyMotivationLastVisit', 'Yesterday');

    render(<DailyMotivation />);
    
    // It should increment to Day 6
    const header = screen.getByText(/Day 6 of Your Carbon Journey/i);
    expect(header).toBeInTheDocument();
  });
});
