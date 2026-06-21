import { describe, it, expect, vi } from 'vitest';
import { generateDailyMissions, analyzeReceiptText } from '../../services/ai';
import { UserProfile } from '../../types';

// Mock the entire @google/genai module as a class constructor
vi.mock('@google/genai', () => {
  class MockGoogleGenAI {
    models = {
      generateContent: async ({ contents }: { contents: string }) => {
        if (contents.includes('sustainability missions')) {
          return {
            text: JSON.stringify([
              {
                id: 'test-1',
                title: 'Mock Mission 1',
                description: 'Do something eco-friendly.',
                category: 'Energy',
                difficulty: 'Easy',
                expectedCo2Save: 1.2,
                xpReward: 15
              }
            ])
          };
        }
        if (contents.includes('receipt or purchase')) {
          return {
            text: JSON.stringify({
              items: ['Apples', 'Bread'],
              totalCo2: 2.3,
              advice: 'Good choice buying grains.'
            })
          };
        }
        return { text: '' };
      }
    };
  }

  return {
    GoogleGenAI: MockGoogleGenAI,
    Type: {
      OBJECT: 'OBJECT',
      ARRAY: 'ARRAY',
      STRING: 'STRING',
      NUMBER: 'NUMBER'
    }
  };
});

describe('AI Service', () => {
  const dummyProfile: UserProfile = {
    userName: 'Tester',
    language: 'English',
    country: 'India',
    state: 'Maharashtra',
    city: 'Mumbai',
    ageGroup: '18–24',
    goal: '🌍 Reduce Carbon Footprint',
    trackerMode: '🤖 AI Automatic Tracker',
    hasSeenTutorial: true
  };

  it('generateDailyMissions resolves successfully and maps completed state', async () => {
    const missions = await generateDailyMissions(dummyProfile);
    expect(missions.length).toBeGreaterThan(0);
    expect(missions[0].id).toBe('test-1');
    expect(missions[0].completed).toBe(false);
  });

  it('analyzeReceiptText parses receipt output correctly', async () => {
    const result = await analyzeReceiptText('Apples and bread');
    expect(result.items).toContain('Apples');
    expect(result.totalCo2).toBe(2.3);
    expect(result.advice).toBe('Good choice buying grains.');
  });
});
