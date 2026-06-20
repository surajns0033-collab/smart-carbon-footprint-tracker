export interface UserProfile {
  userName: string;
  language: string;
  country: string;
  state: string;
  city: string;
  district?: string;
  ageGroup: string;
  gender?: string;
  occupation?: string;
  goal: string;
  trackerMode: string;
  aiCategory?: string;
  aiLevel?: string;
  hasSeenTutorial: boolean;
}

export interface UserStats {
  carbonScore: number;
  healthyLivingScore: number;
  greenXP: number;
  level: number;
  co2SavedKg: number;
  moneySaved: number;
  electricitySaved: number;
  waterSaved: number;
  wasteRecycled: number;
  treesEquivalent: number;
  streakDays: number;
  countryContribution: number;
  stateContribution: number;
  cityContribution: number;
  globalContribution: number;
}

export interface ActivityLog {
  id: string;
  date: string;
  category: string;
  description: string;
  co2Impact: number;
  xpEarned: number;
}

export interface AIMission {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  expectedCo2Save: number;
  xpReward: number;
  completed: boolean;
}

export interface GovTarget {
  country: string;
  netZeroYear: number;
  currentEmissionsMt: number;
  targetEmissionsMt: number;
  renewableTargetPct: number;
  currentRenewablePct: number;
  forestTargetPct: number;
  lastUpdated: string;
  officialSummary: string;
}
