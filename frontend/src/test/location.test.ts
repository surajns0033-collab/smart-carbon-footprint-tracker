import { describe, it, expect } from 'vitest';
import { getCitiesForState, getStatesForCountry, AGE_GROUPS, GENDERS, OCCUPATIONS, GOALS } from '../../constants';

// ─────────────────────────────────────────────
// getCitiesForState
// ─────────────────────────────────────────────
describe('getCitiesForState', () => {
  it('returns Mumbai for Maharashtra', () => {
    const cities = getCitiesForState('Maharashtra');
    expect(cities).toContain('Mumbai');
    expect(cities).toContain('Pune');
  });

  it('returns New Delhi for Delhi', () => {
    const cities = getCitiesForState('Delhi');
    expect(cities).toContain('New Delhi');
  });

  it('returns Bengaluru for Karnataka', () => {
    const cities = getCitiesForState('Karnataka');
    expect(cities).toContain('Bengaluru');
  });

  it('returns Los Angeles for California', () => {
    const cities = getCitiesForState('California');
    expect(cities).toContain('Los Angeles');
  });

  it('returns London for England', () => {
    const cities = getCitiesForState('England');
    expect(cities).toContain('London');
  });

  it('returns generic cities for unknown state', () => {
    const cities = getCitiesForState('Unknown State');
    expect(cities.length).toBeGreaterThan(0);
  });

  it('returns empty array for empty string', () => {
    const cities = getCitiesForState('');
    expect(cities).toEqual([]);
  });
});

// ─────────────────────────────────────────────
// AGE_GROUPS
// ─────────────────────────────────────────────
describe('AGE_GROUPS', () => {
  it('contains expected age ranges', () => {
    expect(AGE_GROUPS).toContain('18–24');
    expect(AGE_GROUPS).toContain('65+');
    expect(AGE_GROUPS).toContain('Under 13');
  });

  it('has at least 5 groups', () => {
    expect(AGE_GROUPS.length).toBeGreaterThanOrEqual(5);
  });

  it('has no duplicates', () => {
    const unique = new Set(AGE_GROUPS);
    expect(unique.size).toBe(AGE_GROUPS.length);
  });
});

// ─────────────────────────────────────────────
// GENDERS
// ─────────────────────────────────────────────
describe('GENDERS', () => {
  it('includes Male and Female', () => {
    expect(GENDERS).toContain('Male');
    expect(GENDERS).toContain('Female');
  });

  it('includes Non-binary and prefer not to say options', () => {
    expect(GENDERS).toContain('Non-binary');
    expect(GENDERS).toContain('Prefer not to say');
  });
});

// ─────────────────────────────────────────────
// OCCUPATIONS
// ─────────────────────────────────────────────
describe('OCCUPATIONS', () => {
  it('includes Student and Employee', () => {
    expect(OCCUPATIONS).toContain('Student');
    expect(OCCUPATIONS).toContain('Employee');
  });

  it('has at least 5 entries', () => {
    expect(OCCUPATIONS.length).toBeGreaterThanOrEqual(5);
  });

  it('all entries are non-empty strings', () => {
    OCCUPATIONS.forEach(o => {
      expect(typeof o).toBe('string');
      expect(o.length).toBeGreaterThan(0);
    });
  });
});

// ─────────────────────────────────────────────
// GOALS
// ─────────────────────────────────────────────
describe('GOALS', () => {
  it('contains carbon footprint goal', () => {
    const found = GOALS.some(g => g.includes('Carbon'));
    expect(found).toBe(true);
  });

  it('has at least 3 goals', () => {
    expect(GOALS.length).toBeGreaterThanOrEqual(3);
  });

  it('all goals are non-empty strings', () => {
    GOALS.forEach(g => {
      expect(typeof g).toBe('string');
      expect(g.length).toBeGreaterThan(0);
    });
  });
});

// ─────────────────────────────────────────────
// State/City Chain
// ─────────────────────────────────────────────
describe('State and City chain lookup', () => {
  it('can chain India → Maharashtra → Mumbai', () => {
    const states = getStatesForCountry('India');
    expect(states).toContain('Maharashtra');
    const cities = getCitiesForState('Maharashtra');
    expect(cities).toContain('Mumbai');
  });

  it('can chain UK → England → London', () => {
    const states = getStatesForCountry('United Kingdom');
    expect(states).toContain('England');
    const cities = getCitiesForState('England');
    expect(cities).toContain('London');
  });

  it('can chain USA → California → Los Angeles', () => {
    const states = getStatesForCountry('United States of America');
    expect(states).toContain('California');
    const cities = getCitiesForState('California');
    expect(cities).toContain('Los Angeles');
  });
});
