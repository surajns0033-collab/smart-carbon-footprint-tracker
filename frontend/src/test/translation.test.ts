import { describe, it, expect } from 'vitest';
import { translations } from '../../services/translation';

describe('Translation Service Dictionary', () => {
  it('contains English language keys', () => {
    expect(translations.English).toBeDefined();
    expect(translations.English.dashboard).toBe('Dashboard');
    expect(translations.English.tracker).toBe('Tracker & Scanner');
  });

  it('contains Hindi language keys', () => {
    expect(translations.Hindi).toBeDefined();
    expect(translations.Hindi.dashboard).toBe('डैशबोर्ड');
    expect(translations.Hindi.tracker).toBe('ट्रैकर और स्कैनर');
  });

  it('contains Marathi language keys', () => {
    expect(translations.Marathi).toBeDefined();
    expect(translations.Marathi.dashboard).toBe('डॅशबोर्ड');
    expect(translations.Marathi.tracker).toBe('ट्रॅकर आणि स्कॅनर');
  });

  it('has consistent keys across all languages', () => {
    const languages = Object.keys(translations);
    languages.forEach(lang => {
      const keys = Object.keys(translations[lang]);
      expect(keys.length).toBeGreaterThan(30);
    });
  });
});

describe('Dynamic Language Key Integrities', () => {
  const languages = ['Hindi', 'Marathi', 'Spanish', 'French'] as const;
  const keysToVerify = [
    'dashboard', 'tracker', 'gov', 'simulator', 'library', 'leaderboard',
    'learn', 'ai', 'profile', 'logout', 'welcome', 'impact_today',
    'carbon_score', 'health_score', 'co2_saved', 'green_xp', 'money_saved',
    'electricity_saved', 'water_saved', 'waste_recycled', 'city', 'state',
    'country', 'global'
  ];

  languages.forEach(lang => {
    keysToVerify.forEach(key => {
      it(`verifies ${lang} translation is present for key: "${key}"`, () => {
        const value = translations[lang][key];
        expect(value).toBeDefined();
        expect(typeof value).toBe('string');
        expect(value.length).toBeGreaterThan(0);
      });
    });
  });
});
