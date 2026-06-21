import { describe, it, expect } from 'vitest';
import { SECTOR_DATA, MOCK_GOV_TARGETS } from '../../constants';

// ─────────────────────────────────────────────
// SECTOR_DATA
// ─────────────────────────────────────────────
describe('SECTOR_DATA', () => {
  it('contains Transport sector', () => {
    expect(SECTOR_DATA['Transport']).toBeDefined();
  });

  it('contains Electricity sector', () => {
    expect(SECTOR_DATA['Electricity']).toBeDefined();
  });

  it('all sectors have percentage, description, keyActions', () => {
    Object.entries(SECTOR_DATA).forEach(([name, data]) => {
      expect(data.percentage).toBeGreaterThan(0);
      expect(typeof data.description).toBe('string');
      expect(Array.isArray(data.keyActions)).toBe(true);
      expect(data.keyActions.length).toBeGreaterThan(0);
    });
  });

  it('Transport sector has correct approximate percentage', () => {
    expect(SECTOR_DATA['Transport'].percentage).toBeGreaterThan(10);
    expect(SECTOR_DATA['Transport'].percentage).toBeLessThan(40);
  });

  it('Electricity sector is the largest emitter', () => {
    const elec = SECTOR_DATA['Electricity'].percentage;
    const transport = SECTOR_DATA['Transport'].percentage;
    expect(elec).toBeGreaterThan(transport);
  });

  it('all sector percentages are positive numbers', () => {
    Object.values(SECTOR_DATA).forEach(data => {
      expect(data.percentage).toBeGreaterThan(0);
    });
  });

  it('sector key actions contain strings', () => {
    Object.values(SECTOR_DATA).forEach(data => {
      data.keyActions.forEach(action => {
        expect(typeof action).toBe('string');
        expect(action.length).toBeGreaterThan(0);
      });
    });
  });
});

// ─────────────────────────────────────────────
// MOCK_GOV_TARGETS
// ─────────────────────────────────────────────
describe('MOCK_GOV_TARGETS', () => {
  it('contains India', () => {
    expect(MOCK_GOV_TARGETS['India']).toBeDefined();
  });

  it('India has a net zero year', () => {
    expect(MOCK_GOV_TARGETS['India'].netZeroYear).toBeGreaterThan(2000);
  });

  it('India net zero year is in the future (2040+)', () => {
    expect(MOCK_GOV_TARGETS['India'].netZeroYear).toBeGreaterThanOrEqual(2040);
  });

  it('contains USA', () => {
    expect(MOCK_GOV_TARGETS['United States of America']).toBeDefined();
  });

  it('contains UK', () => {
    expect(MOCK_GOV_TARGETS['United Kingdom']).toBeDefined();
  });

  it('all targets have currentEmissionsMt and targetEmissionsMt', () => {
    Object.values(MOCK_GOV_TARGETS).forEach(target => {
      expect(target.currentEmissionsMt).toBeGreaterThan(0);
      expect(target.targetEmissionsMt).toBeGreaterThan(0);
    });
  });

  it('target emissions are less than current emissions (reduction goal)', () => {
    Object.values(MOCK_GOV_TARGETS).forEach(target => {
      expect(target.targetEmissionsMt).toBeLessThan(target.currentEmissionsMt);
    });
  });

  it('renewable targets are valid percentages (0–100)', () => {
    Object.values(MOCK_GOV_TARGETS).forEach(target => {
      expect(target.renewableTargetPct).toBeGreaterThan(0);
      expect(target.renewableTargetPct).toBeLessThanOrEqual(100);
    });
  });

  it('all targets have an official summary', () => {
    Object.values(MOCK_GOV_TARGETS).forEach(target => {
      expect(target.officialSummary).toBeTruthy();
      expect(target.officialSummary.length).toBeGreaterThan(10);
    });
  });
});
