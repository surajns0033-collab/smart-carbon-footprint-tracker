import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Simulator, Library, Leaderboard } from '../../components/Views';

vi.mock('../../context/AppContext', () => ({
  useAppContext: () => ({
    stats: {
      streakDays: 5,
      carbonScore: 400
    },
    profile: {
      userName: 'Alice',
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai'
    }
  })
}));

describe('Simulator Component', () => {
  it('renders and responds to action changes', () => {
    render(<Simulator />);
    
    expect(screen.getByText(/What If Simulator/i)).toBeInTheDocument();
    
    // Choose EV initially
    expect(screen.getByText('-2500 kg')).toBeInTheDocument();

    // Select solar panels
    const dropdown = screen.getByRole('combobox');
    fireEvent.change(dropdown, { target: { value: 'Install Solar Panels' } });

    expect(screen.getByText('-3000 kg')).toBeInTheDocument();
  });
});

describe('Library Component', () => {
  it('filters carbon database items based on query', () => {
    render(<Library />);

    expect(screen.getByText(/Carbon Source Library/i)).toBeInTheDocument();

    const searchInput = screen.getByPlaceholderText(/Search activities/i);
    fireEvent.change(searchInput, { target: { value: 'flight' } });

    // Flight entries should match
    const flightRows = screen.queryAllByText(/flight/i);
    expect(flightRows.length).toBeGreaterThan(0);
  });
});

describe('Leaderboard Component', () => {
  it('renders stats leaderboard entries', () => {
    render(<Leaderboard />);

    expect(screen.getByText(/Leaderboards/i)).toBeInTheDocument();
    expect(screen.getByText(/Top Contributors in/i)).toBeInTheDocument();
  });
});
