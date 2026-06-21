import { describe, it, expect } from 'vitest';
import {
  getLevelName,
  getStatesForCountry,
  getCitiesForState,
  LANGUAGES,
  COUNTRIES,
  LEVELS,
  MANUAL_CATEGORIES,
  CARBON_DATABASE,
  TRACKER_MODES,
} from '../../constants';

// ─────────────────────────────────────────────
// getLevelName
// ─────────────────────────────────────────────
describe('getLevelName', () => {
  it('returns "Eco Beginner" for 0 XP', () => {
    expect(getLevelName(0)).toBe('Eco Beginner');
  });

  it('returns "Green Explorer" for 500 XP', () => {
    expect(getLevelName(500)).toBe('Green Explorer');
  });

  it('returns "Climate Warrior" for 1500 XP', () => {
    expect(getLevelName(1500)).toBe('Climate Warrior');
  });

  it('returns "Earth Guardian" for 3000 XP', () => {
    expect(getLevelName(3000)).toBe('Earth Guardian');
  });

  it('returns "Planet Protector" for 5000 XP', () => {
    expect(getLevelName(5000)).toBe('Planet Protector');
  });

  it('returns "Net Zero Hero" for 10000 XP', () => {
    expect(getLevelName(10000)).toBe('Net Zero Hero');
  });

  it('returns "Climate Legend" for 20000 XP', () => {
    expect(getLevelName(20000)).toBe('Climate Legend');
  });

  it('returns highest applicable level for XP between thresholds', () => {
    expect(getLevelName(999)).toBe('Green Explorer');
    expect(getLevelName(2999)).toBe('Climate Warrior');
  });

  it('handles very large XP values', () => {
    expect(getLevelName(999999)).toBe('Climate Legend');
  });

  it('handles negative XP gracefully', () => {
    // Should return lowest level (Eco Beginner)
    expect(getLevelName(-100)).toBe('Eco Beginner');
  });
});

// ─────────────────────────────────────────────
// getStatesForCountry
// ─────────────────────────────────────────────
describe('getStatesForCountry', () => {
  it('returns Indian states for India', () => {
    const states = getStatesForCountry('India');
    expect(states).toContain('Maharashtra');
    expect(states).toContain('Karnataka');
    expect(states).toContain('Delhi');
    expect(states.length).toBeGreaterThan(10);
  });

  it('returns US states for United States of America', () => {
    const states = getStatesForCountry('United States of America');
    expect(states).toContain('California');
    expect(states).toContain('Texas');
  });

  it('returns UK regions for United Kingdom', () => {
    const states = getStatesForCountry('United Kingdom');
    expect(states).toContain('England');
    expect(states).toContain('Scotland');
  });

  it('returns generic states for unknown countries', () => {
    const states = getStatesForCountry('Unknown Country');
    expect(states.length).toBeGreaterThan(0);
  });

  it('returns empty array for empty string', () => {
    const states = getStatesForCountry('');
    expect(states).toEqual([]);
  });
});

// ─────────────────────────────────────────────
// CONSTANTS integrity
// ─────────────────────────────────────────────
describe('LANGUAGES constant', () => {
  it('contains English', () => {
    expect(LANGUAGES).toContain('English');
  });

  it('contains Hindi', () => {
    expect(LANGUAGES).toContain('Hindi');
  });

  it('contains expected number of languages', () => {
    expect(LANGUAGES.length).toBeGreaterThanOrEqual(10);
  });

  it('has no duplicate languages', () => {
    const unique = new Set(LANGUAGES);
    expect(unique.size).toBe(LANGUAGES.length);
  });
});

describe('COUNTRIES constant', () => {
  it('contains India', () => {
    expect(COUNTRIES).toContain('India');
  });

  it('contains United States of America', () => {
    expect(COUNTRIES).toContain('United States of America');
  });

  it('has more than 100 countries', () => {
    expect(COUNTRIES.length).toBeGreaterThan(100);
  });

  it('has no duplicate countries', () => {
    const unique = new Set(COUNTRIES);
    expect(unique.size).toBe(COUNTRIES.length);
  });
});

describe('LEVELS constant', () => {
  it('starts with level 1 at 0 XP', () => {
    expect(LEVELS[0].level).toBe(1);
    expect(LEVELS[0].minXp).toBe(0);
  });

  it('levels are sorted in ascending order of XP', () => {
    for (let i = 1; i < LEVELS.length; i++) {
      expect(LEVELS[i].minXp).toBeGreaterThan(LEVELS[i - 1].minXp);
    }
  });

  it('all levels have a name', () => {
    LEVELS.forEach(l => {
      expect(l.name).toBeTruthy();
      expect(typeof l.name).toBe('string');
    });
  });
});

describe('MANUAL_CATEGORIES constant', () => {
  it('contains Transport category', () => {
    const names = MANUAL_CATEGORIES.map(c => c.name);
    expect(names).toContain('Transport');
  });

  it('contains Electricity category', () => {
    const names = MANUAL_CATEGORIES.map(c => c.name);
    expect(names).toContain('Electricity');
  });

  it('each category has options array', () => {
    MANUAL_CATEGORIES.forEach(cat => {
      expect(Array.isArray(cat.options)).toBe(true);
      expect(cat.options.length).toBeGreaterThan(0);
    });
  });
});

describe('CARBON_DATABASE', () => {
  it('has entries', () => {
    expect(CARBON_DATABASE.length).toBeGreaterThan(0);
  });

  it('all entries have required fields', () => {
    CARBON_DATABASE.forEach(entry => {
      expect(entry.activity).toBeTruthy();
      expect(typeof entry.impact).toBe('number');
      expect(entry.category).toBeTruthy();
    });
  });

  it('impact values are non-negative', () => {
    CARBON_DATABASE.forEach(entry => {
      expect(entry.impact).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('TRACKER_MODES', () => {
  it('has exactly 2 modes', () => {
    expect(TRACKER_MODES.length).toBe(2);
  });

  it('contains AI mode', () => {
    expect(TRACKER_MODES[0]).toContain('AI');
  });

  it('contains Manual mode', () => {
    expect(TRACKER_MODES[1]).toContain('Manual');
  });
});
