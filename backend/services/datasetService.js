// datasetService.js – ETL to download and normalize emission factor datasets
import fetch from 'node-fetch';
import { parse } from 'csv-parse/sync';
import { db } from '../db.js';

// URLs of open-source datasets (you can extend this list)
const DATASET_SOURCES = [
  {
    name: 'OWID CO2 per Capita',
    url: 'https://raw.githubusercontent.com/owid/co2-data/master/owid-co2-data.csv',
    // The CSV contains many columns; we will extract `country`, `year`, and `co2_per_capita` as factor
    parser: (record) => ({
      source: 'OWID',
      sector: 'CO2_per_capita',
      country: record['country'] || record['Country'] || '',
      region: '',
      year: parseInt(record['year'] || record['Year'] || '0', 10),
      factor: parseFloat(record['co2_per_capita'] || record['co2_per_capita'] || '0'),
    }),
    attribution: 'Our World in Data',
  },
];

/**
 * Downloads a CSV, parses it, and returns an array of normalized records.
 */
async function fetchAndNormalize(source) {
  const response = await fetch(source.url);
  if (!response.ok) {
    console.error(`Failed to fetch ${source.name}: ${response.statusText}`);
    return [];
  }
  const csvText = await response.text();
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
  });
  const normalized = records.map(source.parser).filter((r) => r.country && r.year && r.factor);
  // Attach attribution & lastUpdated
  const now = new Date().toISOString();
  normalized.forEach((r) => {
    r.source = source.attribution;
    r.lastUpdated = now;
    r.confidence = 1.0; // placeholder confidence
  });
  return normalized;
}

/** Load all datasets into SQLite (replace existing rows for the same source/sector/year). */
export async function loadDatasets() {
  console.log('Starting dataset ETL...');
  for (const src of DATASET_SOURCES) {
    try {
      const records = await fetchAndNormalize(src);
      console.log(`Fetched ${records.length} records from ${src.name}`);
      const insertStmt = db.prepare(`INSERT INTO datasets (source, sector, country, region, year, factor, lastUpdated, confidence)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?);`);
      db.serialize(() => {
        db.run('BEGIN TRANSACTION;');
        for (const rec of records) {
          insertStmt.run(
            rec.source,
            rec.sector,
            rec.country,
            rec.region,
            rec.year,
            rec.factor,
            rec.lastUpdated,
            rec.confidence,
          );
        }
        db.run('COMMIT;');
      });
      insertStmt.finalize();
    } catch (e) {
      console.error(`Error loading dataset ${src.name}:`, e);
    }
  }
  console.log('Dataset ETL completed.');
}
