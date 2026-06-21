import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { GovTargets } from '../../components/GovTargets';

vi.mock('../../context/AppContext', () => ({
  useAppContext: () => ({
    profile: {
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai'
    }
  })
}));

describe('GovTargets Component tests', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch').mockImplementation(() => 
      Promise.resolve({
        json: () => Promise.resolve({
          success: true,
          location: { lat: 19.07, lng: 72.87 },
          grid: { carbonIntensityGCO2: 450, renewablePercentage: 20, status: 'Fair' }
        })
      } as any)
    );
  });

  it('renders default target headers correctly', () => {
    render(<GovTargets />);
    expect(screen.getByText(/Government Climate Target Engine/i)).toBeInTheDocument();
  });

  it('contains national target tab initially', () => {
    render(<GovTargets />);
    expect(screen.getByText(/Net Zero Target/i)).toBeInTheDocument();
  });

  it('displays mock net zero target year for India', () => {
    render(<GovTargets />);
    expect(screen.getByText('2070')).toBeInTheDocument();
  });

  it('switches to global tab correctly', () => {
    render(<GovTargets />);
    const globalTab = screen.getByText('Global Carbon Explorer');
    fireEvent.click(globalTab);
    expect(screen.getByText(/Explore emissions data for 240\+ countries/i)).toBeInTheDocument();
  });

  it('switches to local tab correctly', () => {
    render(<GovTargets />);
    const localTab = screen.getByText('State & City Dashboard');
    fireEvent.click(localTab);
    expect(screen.getByRole('heading', { name: /State Dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /City Dashboard/i })).toBeInTheDocument();
  });

  it('switches to sector tab correctly', () => {
    render(<GovTargets />);
    const sectorTab = screen.getByText('Sector Explorer');
    fireEvent.click(sectorTab);
    expect(screen.getByText(/Key Mitigation Actions/i)).toBeInTheDocument();
  });

  it('handles sector tab mitigation changes', () => {
    render(<GovTargets />);
    const sectorTab = screen.getByText('Sector Explorer');
    fireEvent.click(sectorTab);
    
    // Choose Electricity sector
    const elecBtn = screen.getByRole('button', { name: 'Electricity' });
    fireEvent.click(elecBtn);
    expect(screen.getByRole('heading', { name: 'Electricity' })).toBeInTheDocument();
  });

  it('shows official summary for selected country', () => {
    render(<GovTargets />);
    expect(screen.getByText(/Official Climate Commitment Summary/i)).toBeInTheDocument();
  });

  it('renders grid cleanliness elements', async () => {
    render(<GovTargets />);
    const elements = await screen.findAllByText(/Grid/i);
    expect(elements.length).toBeGreaterThan(0);
  });

  it('renders renewable targets cards', () => {
    render(<GovTargets />);
    expect(screen.getByText(/Renewable Energy Target/i)).toBeInTheDocument();
  });

  it('renders forest sink targets card', () => {
    render(<GovTargets />);
    expect(screen.getByText(/Forest \/ Carbon Sink/i)).toBeInTheDocument();
  });

  it('fetches coordinates correctly from live response', async () => {
    render(<GovTargets />);
    const elements = await screen.findAllByText(/Coordinates/i);
    expect(elements.length).toBeGreaterThan(0);
  });
});
