import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../../App';

// Mock matchMedia for recharts/responsive layouts in tests
window.matchMedia = window.matchMedia || function() {
  return {
    matches: false,
    addListener: function() {},
    removeListener: function() {}
  };
};

describe('App Root and Routing', () => {
  beforeEach(() => {
    window.history.pushState({}, 'Test page', '/smart-carbon-footprint-tracker/');
  });

  it('renders skip-to-content links and critical accessibility anchors', () => {
    render(<App />);
    const skipLink = screen.getByText(/skip to main content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  it('renders application onboarding or main flow container', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });
});
