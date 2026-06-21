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
const mockSetViewMode = vi.fn();

vi.mock('../../context/AppContext', () => ({
  useAppContext: () => ({
    logout: mockLogout,
    viewMode: 'desktop',
    setViewMode: mockSetViewMode,
    profile: {
      language: 'English'
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
    expect(screen.getByText(/Smart Carbon/i)).toBeInTheDocument();

    // Verify nav links render
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Tracker/i)).toBeInTheDocument();

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

    const themeToggle = screen.getAllByTitle(/Switch to Dark Mode/i)[0];
    expect(themeToggle).toBeInTheDocument();
    fireEvent.click(themeToggle);

    // Document element class should contain 'dark'
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
