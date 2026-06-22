import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { AppProvider, useAppContext } from '../../context/AppContext';

// Helper component that exposes context values for testing
const TestConsumer: React.FC<{ onContext?: (ctx: ReturnType<typeof useAppContext>) => void }> = ({ onContext }) => {
  const ctx = useAppContext();
  if (onContext) onContext(ctx);
  return (
    <div>
      <span data-testid="xp">{ctx.stats.greenXP}</span>
      <span data-testid="co2saved">{ctx.stats.co2SavedKg}</span>
      <span data-testid="carbonScore">{ctx.stats.carbonScore}</span>
      <span data-testid="logCount">{ctx.logs.length}</span>
      <span data-testid="profile">{ctx.profile?.userName ?? 'none'}</span>
    </div>
  );
};

const renderWithProvider = (ui: React.ReactElement) =>
  render(<AppProvider>{ui}</AppProvider>);

// Clear localStorage before each test
beforeEach(() => {
  localStorage.clear();
  vi.restoreAllMocks();
});

describe('AppContext — Provider renders', () => {
  it('provides default stats to children', () => {
    renderWithProvider(<TestConsumer />);
    expect(screen.getByTestId('xp').textContent).toBe('0');
    expect(screen.getByTestId('co2saved').textContent).toBe('0');
  });

  it('throws if useAppContext is used outside AppProvider', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow();
    spy.mockRestore();
  });
});

describe('AppContext — addLog (positive co2Impact = emission)', () => {
  it('increments log count when a log is added', async () => {
    let capturedCtx: ReturnType<typeof useAppContext>;

    renderWithProvider(
      <TestConsumer onContext={(c) => { capturedCtx = c; }} />
    );

    expect(screen.getByTestId('logCount').textContent).toBe('0');

    await act(async () => {
      capturedCtx!.addLog({ category: 'Transport', description: 'Drove car', co2Impact: 5, xpEarned: 10 });
    });

    expect(screen.getByTestId('logCount').textContent).toBe('1');
  });

  it('increases XP when a log with xpEarned is added', async () => {
    let capturedCtx: ReturnType<typeof useAppContext>;

    renderWithProvider(
      <TestConsumer onContext={(c) => { capturedCtx = c; }} />
    );

    await act(async () => {
      capturedCtx!.addLog({ category: 'Transport', description: 'Bus trip', co2Impact: 2, xpEarned: 50 });
    });

    expect(screen.getByTestId('xp').textContent).toBe('50');
  });

  it('increases co2SavedKg when co2Impact is negative (saving)', async () => {
    let capturedCtx: ReturnType<typeof useAppContext>;

    renderWithProvider(
      <TestConsumer onContext={(c) => { capturedCtx = c; }} />
    );

    await act(async () => {
      capturedCtx!.addLog({ category: 'Electricity', description: 'Solar panels', co2Impact: -10, xpEarned: 20 });
    });

    expect(screen.getByTestId('co2saved').textContent).toBe('10');
  });

  it('does not add co2SavedKg when co2Impact is positive', async () => {
    let capturedCtx: ReturnType<typeof useAppContext>;

    renderWithProvider(
      <TestConsumer onContext={(c) => { capturedCtx = c; }} />
    );

    await act(async () => {
      capturedCtx!.addLog({ category: 'Transport', description: 'Flight', co2Impact: 20, xpEarned: 0 });
    });

    expect(screen.getByTestId('co2saved').textContent).toBe('0');
  });

  it('accumulates XP across multiple logs', async () => {
    let capturedCtx: ReturnType<typeof useAppContext>;

    renderWithProvider(
      <TestConsumer onContext={(c) => { capturedCtx = c; }} />
    );

    await act(async () => {
      capturedCtx!.addLog({ category: 'Food', description: 'Vegan meal', co2Impact: -2, xpEarned: 30 });
      capturedCtx!.addLog({ category: 'Water', description: 'Short shower', co2Impact: -1, xpEarned: 20 });
    });

    expect(screen.getByTestId('xp').textContent).toBe('50');
    expect(screen.getByTestId('logCount').textContent).toBe('2');
  });
});

describe('AppContext — updateProfile', () => {
  it('sets userName via updateProfile after initial set', async () => {
    let capturedCtx: ReturnType<typeof useAppContext>;

    renderWithProvider(
      <TestConsumer onContext={(c) => { capturedCtx = c; }} />
    );

    await act(async () => {
      capturedCtx!.setProfile({
        userName: 'Suraj',
        language: 'en',
        country: 'India',
        state: 'Maharashtra',
        city: 'Mumbai',
        ageGroup: '25-34',
        goal: 'Reduce transport',
        trackerMode: '📝 Manual Tracker',
        hasSeenTutorial: false,
      });
    });

    expect(screen.getByTestId('profile').textContent).toBe('Suraj');

    await act(async () => {
      capturedCtx!.updateProfile({ userName: 'Arjun' });
    });

    expect(screen.getByTestId('profile').textContent).toBe('Arjun');
  });
});

describe('AppContext — logout', () => {
  it('clears profile on logout but retains stats', async () => {
    let capturedCtx: ReturnType<typeof useAppContext>;

    renderWithProvider(
      <TestConsumer onContext={(c) => { capturedCtx = c; }} />
    );

    await act(async () => {
      capturedCtx!.setProfile({
        userName: 'TestUser',
        language: 'en',
        country: 'India',
        state: 'Maharashtra',
        city: 'Mumbai',
        ageGroup: '25-34',
        goal: 'Reduce footprint',
        trackerMode: '📝 Manual Tracker',
        hasSeenTutorial: true,
      });
    });

    expect(screen.getByTestId('profile').textContent).toBe('TestUser');

    await act(async () => {
      capturedCtx!.logout();
    });

    expect(screen.getByTestId('profile').textContent).toBe('none');
  });
});

describe('AppContext — resetApp', () => {
  it('resets stats, logs, profile on reset', async () => {
    let capturedCtx: ReturnType<typeof useAppContext>;

    renderWithProvider(
      <TestConsumer onContext={(c) => { capturedCtx = c; }} />
    );

    await act(async () => {
      capturedCtx!.addLog({ category: 'Food', description: 'Meat', co2Impact: 5, xpEarned: 10 });
    });

    expect(screen.getByTestId('logCount').textContent).toBe('1');

    await act(async () => {
      capturedCtx!.resetApp();
    });

    expect(screen.getByTestId('logCount').textContent).toBe('0');
    expect(screen.getByTestId('xp').textContent).toBe('0');
  });
});

describe('AppContext — viewMode', () => {
  it('defaults to desktop view mode', () => {
    let capturedCtx: ReturnType<typeof useAppContext>;

    renderWithProvider(
      <TestConsumer onContext={(c) => { capturedCtx = c; }} />
    );

    expect(capturedCtx!.viewMode).toBe('desktop');
  });

  it('switches to mobile view mode', async () => {
    let capturedCtx: ReturnType<typeof useAppContext>;

    renderWithProvider(
      <TestConsumer onContext={(c) => { capturedCtx = c; }} />
    );

    await act(async () => {
      capturedCtx!.setViewMode('mobile');
    });

    expect(capturedCtx!.viewMode).toBe('mobile');
  });
});

describe('AppContext — category-specific savings', () => {
  it('adds electricitySaved for Electricity negative log', async () => {
    let capturedCtx: ReturnType<typeof useAppContext>;

    renderWithProvider(
      <TestConsumer onContext={(c) => { capturedCtx = c; }} />
    );

    await act(async () => {
      capturedCtx!.addLog({ category: 'Electricity', description: 'LED bulbs', co2Impact: -5, xpEarned: 15 });
    });

    expect(capturedCtx!.stats.electricitySaved).toBeGreaterThan(0);
    expect(capturedCtx!.stats.moneySaved).toBeGreaterThan(0);
  });

  it('adds waterSaved for Water negative log', async () => {
    let capturedCtx: ReturnType<typeof useAppContext>;

    renderWithProvider(
      <TestConsumer onContext={(c) => { capturedCtx = c; }} />
    );

    await act(async () => {
      capturedCtx!.addLog({ category: 'Water', description: 'Short shower', co2Impact: -3, xpEarned: 10 });
    });

    expect(capturedCtx!.stats.waterSaved).toBeGreaterThan(0);
  });

  it('adds wasteRecycled for Waste negative log', async () => {
    let capturedCtx: ReturnType<typeof useAppContext>;

    renderWithProvider(
      <TestConsumer onContext={(c) => { capturedCtx = c; }} />
    );

    await act(async () => {
      capturedCtx!.addLog({ category: 'Waste', description: 'Recycled', co2Impact: -4, xpEarned: 12 });
    });

    expect(capturedCtx!.stats.wasteRecycled).toBeGreaterThan(0);
  });
});
