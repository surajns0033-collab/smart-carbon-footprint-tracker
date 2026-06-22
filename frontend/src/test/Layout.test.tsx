import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Layout } from '../../components/Layout';

// Mock matchMedia for recharts/responsive layouts in tests
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

const mockLogout = vi.fn();

vi.mock('../../context/AppContext', () => ({
  useAppContext: () => ({
    logout: mockLogout,
    profile: {
      language: 'English',
      userName: 'Arjun Sharma',
      city: 'Mumbai',
      state: 'Maharashtra',
      country: 'India',
      goal: 'Reduce by 20%',
      trackerMode: '🤖 AI Automatic Tracker'
    },
    stats: {
      carbonScore: 850,
      healthyLivingScore: 50,
      greenXP: 100,
      level: 1,
      co2SavedKg: 0,
      moneySaved: 0,
      electricitySaved: 0,
      waterSaved: 0,
      wasteRecycled: 0,
      treesEquivalent: 0,
      streakDays: 1,
      countryContribution: 0.0001,
      stateContribution: 0.005,
      cityContribution: 0.02,
      globalContribution: 0.000001
    }
  })
}));

describe('Layout Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('renders side navigation bar and logout links', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Layout>
          <div data-testid="child-content">Main Body Content</div>
        </Layout>
      </MemoryRouter>
    );

    // Verify main body children content renders
    expect(screen.getByTestId('child-content')).toBeInTheDocument();

    // Verify sidebar brand name renders
    expect(screen.getByText(/EcoTrack/i)).toBeInTheDocument();

    // Verify nav links render
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily Log/i)).toBeInTheDocument();

    // Verify logout button renders and triggers action
    const logoutBtn = screen.getByRole('button', { name: /Logout/i });
    expect(logoutBtn).toBeInTheDocument();
    fireEvent.click(logoutBtn);
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });

  it('handles theme switcher correctly', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Child</div>
        </Layout>
      </MemoryRouter>
    );

    // Since it defaults to Dark Mode, match by 'Switch to Light Mode'
    const themeToggle = screen.getByRole('button', { name: /Switch to Light Mode/i });
    expect(themeToggle).toBeInTheDocument();
    fireEvent.click(themeToggle);

    // Document element class should NOT contain 'dark' after switching to light
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });
});
