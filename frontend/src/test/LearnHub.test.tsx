import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { LearnHub } from '../../components/LearnHub';

describe('LearnHub Component', () => {
  it('renders title and simple terms correctly', () => {
    render(<LearnHub />);

    expect(screen.getByText(/Learn Hub/i)).toBeInTheDocument();
    expect(screen.getByText(/Simple explanations for climate science terminology/i)).toBeInTheDocument();

    // Verify key terms render
    expect(screen.getByText('Carbon Footprint')).toBeInTheDocument();
    expect(screen.getByText('Net Zero')).toBeInTheDocument();
    expect(screen.getByText('Renewable Energy')).toBeInTheDocument();
  });
});
