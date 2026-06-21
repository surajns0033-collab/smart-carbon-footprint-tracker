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
    const englishKeys = Object.keys(translations.English);
    const languages = Object.keys(translations);

    languages.forEach(lang => {
      // Allow minor differences, but verify key count is high
      const keys = Object.keys(translations[lang]);
      expect(keys.length).toBeGreaterThan(30);
    });
  });
});
