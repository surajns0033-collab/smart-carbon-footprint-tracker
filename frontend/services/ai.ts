import { GoogleGenAI, Type } from '@google/genai';
import { UserProfile, AIMission } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

export const generateDailyMissions = async (profile: UserProfile): Promise<AIMission[]> => {
  try {
    const prompt = `Generate 3 daily sustainability missions for a user with the following profile:
    Country: ${profile.country}, City: ${profile.city}
    Age: ${profile.ageGroup}, Occupation: ${profile.occupation || 'Not specified'}
    Primary Goal: ${profile.goal}
    Tracker Mode: ${profile.trackerMode}
    AI Category Focus: ${profile.aiCategory || 'General'}
    AI Difficulty Level: ${profile.aiLevel || 'Standard'}
    
    Make them highly actionable, realistic, and tailored to their specific AI Category Focus and Difficulty Level.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: 'Unique ID' },
              title: { type: Type.STRING, description: 'Short catchy title' },
              description: { type: Type.STRING, description: 'Detailed action to take' },
              category: { type: Type.STRING, description: 'e.g., Transport, Energy, Food, Water' },
              difficulty: { type: Type.STRING, description: 'Easy, Medium, or Hard' },
              expectedCo2Save: { type: Type.NUMBER, description: 'Estimated kg CO2 saved' },
              xpReward: { type: Type.NUMBER, description: 'XP points for completing (10-50)' }
            },
            required: ['id', 'title', 'description', 'category', 'difficulty', 'expectedCo2Save', 'xpReward']
          }
        }
      }
    });

    if (response.text) {
      const missions = JSON.parse(response.text);
      return missions.map((m: any) => ({ ...m, completed: false }));
    }
    return [];
  } catch (error) {
    console.error("Error generating missions:", error);
    return [
      { id: '1', title: 'Meatless Meal', description: 'Have one completely vegetarian meal today.', category: 'Food', difficulty: 'Easy', expectedCo2Save: 1.5, xpReward: 20, completed: false },
      { id: '2', title: 'Unplug Devices', description: 'Unplug 3 devices that are not in use.', category: 'Energy', difficulty: 'Easy', expectedCo2Save: 0.5, xpReward: 10, completed: false },
      { id: '3', title: 'Walk or Cycle', description: 'Replace a short car trip with walking or cycling.', category: 'Transport', difficulty: 'Medium', expectedCo2Save: 2.0, xpReward: 30, completed: false }
    ];
  }
};

export const analyzeReceiptText = async (receiptText: string): Promise<{ items: string[], totalCo2: number, advice: string }> => {
  try {
    const prompt = `Analyze this text describing a receipt or purchase: "${receiptText}".
    Identify the items bought, estimate the total carbon footprint (kg CO2e) of these items combined, and provide a short piece of eco-friendly advice for future similar purchases.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            items: { type: Type.ARRAY, items: { type: Type.STRING } },
            totalCo2: { type: Type.NUMBER },
            advice: { type: Type.STRING }
          },
          required: ['items', 'totalCo2', 'advice']
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("Empty response");
  } catch (error) {
    console.error("Error analyzing receipt:", error);
    return { items: ['Unknown Item'], totalCo2: 5.0, advice: 'Try to buy local and seasonal products to reduce carbon footprint.' };
  }
};
