import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Tutorial } from '../../components/Tutorial';

// Mock the context hook with the exact path resolved in the test environment
const mockUpdateProfile = vi.fn();

vi.mock('../../context/AppContext', () => ({
  useAppContext: () => ({
    updateProfile: mockUpdateProfile
  })
}));

describe('Tutorial Component', () => {
  it('renders step 0 content and handles walkthrough progression', () => {
    render(<Tutorial />);

    // Step 0: Welcome step
    expect(screen.getByText(/Welcome to Smart Carbon Tracker/i)).toBeInTheDocument();

    const nextBtn = screen.getByRole('button', { name: /Next/i });
    expect(nextBtn).toBeInTheDocument();

    // Click Next to step 1
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Track Your Impact/i)).toBeInTheDocument();

    // Click Next to step 2
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Global & Local Goals/i)).toBeInTheDocument();

    // Click Next to step 3
    fireEvent.click(nextBtn);
    expect(screen.getByText(/Earn Green XP/i)).toBeInTheDocument();

    // Find the final finish button
    const finishBtn = screen.getByRole('button', { name: /Got it!/i });
    expect(finishBtn).toBeInTheDocument();

    // Click finish to trigger state update
    fireEvent.click(finishBtn);
    expect(mockUpdateProfile).toHaveBeenCalledWith({ hasSeenTutorial: true });
  });
});
