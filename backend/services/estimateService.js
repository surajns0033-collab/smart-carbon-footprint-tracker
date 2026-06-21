// estimateService.js – simple emission calculation based on activity and dataset factor
import { db } from '../db.js';

/**
 * Calculate emissions for a given activity payload.
 * Expected payload shape:
 * {
 *   userId: number,
 *   category: string, // e.g., "transport"
 *   subCategory: string, // e.g., "car"
 *   amount: number, // quantity (e.g., km, kWh)
 *   unit: string // unit of amount
 * }
 */
export async function calculateEmission(payload) {
  // Simple lookup: find latest factor for the subCategory in the datasets table.
  const row = await new Promise((resolve, reject) => {
    const sql = `SELECT factor FROM datasets WHERE sector = ? ORDER BY lastUpdated DESC LIMIT 1;`;
    db.get(sql, [payload.subCategory], (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  const factor = row && row.factor ? row.factor : 0; // default to 0 if not found
  // For demo, assume factor = kg CO2 per unit.
  const emissionKg = payload.amount * factor;
  return emissionKg;
}
