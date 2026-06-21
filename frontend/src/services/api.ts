// src/services/api.ts
// Frontend API wrapper using fetch

export async function fetchDatasets() {
  const res = await fetch('/api/datasets');
  if (!res.ok) throw new Error('Failed to fetch datasets');
  const data = await res.json();
  return data.datasets;
}

export async function estimateEmission(payload: any) {
  const res = await fetch('/api/estimate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Estimation failed');
  const data = await res.json();
  return data.emissionKg;
}

export async function createUser(user: any) {
  const res = await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('User creation failed');
  const data = await res.json();
  return data.userId;
}

export async function fetchLeaderboard() {
  const res = await fetch('/api/leaderboard');
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  const data = await res.json();
  return data.leaderboard;
}
