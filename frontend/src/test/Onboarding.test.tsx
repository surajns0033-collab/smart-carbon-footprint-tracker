import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Onboarding } from '../../components/Onboarding';

const mockSetProfile = vi.fn();

vi.mock('../../context/AppContext', () => ({
  useAppContext: () => ({
    setProfile: mockSetProfile
  })
}));

describe('Onboarding Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Step 1 and does not proceed if validation fails', () => {
    render(<Onboarding />);
    
    // Greeting on English language selection
    expect(screen.getByText(/Smart Carbon Footprint Tracker/i)).toBeInTheDocument();
    
    // Find next button (or submit)
    const nextBtn = screen.getByRole('button');
    expect(nextBtn).toBeDisabled();
  });

  it('allows proceeding to Step 2 and final submission when fields are filled', () => {
    render(<Onboarding />);
    
    // Fill Username
    const usernameInput = screen.getByPlaceholderText(/Enter your name/i);
    fireEvent.change(usernameInput, { target: { value: 'Alice' } });

    // Button should now be enabled
    const nextBtn = screen.getByRole('button');
    expect(nextBtn).not.toBeDisabled();
    
    // Click to go to Step 2
    fireEvent.click(nextBtn);

    // Step 2 content: Country selection
    expect(screen.getByText(/Where are you from/i)).toBeInTheDocument();
    
    // Select country
    const countrySelect = screen.getByRole('combobox');
    fireEvent.change(countrySelect, { target: { value: 'India' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Start Tracking/i });
    fireEvent.click(submitBtn);

    expect(mockSetProfile).toHaveBeenCalledTimes(1);
    expect(mockSetProfile).toHaveBeenCalledWith(expect.objectContaining({
      userName: 'Alice',
      country: 'India',
      language: 'English'
    }));
  });
});
