import { useState, useEffect } from 'react';

// Live data endpoint (World Bank CO₂ per capita) with fallback to local JSON.
const LIVE_EMISSIONS_API = 'https://api.worldbank.org/v2/country/all/indicator/EN.ATM.CO2E.PC?format=json';
const LOCAL_EMISSIONS_FILE = '/emissions.json';
const CACHE_KEY = 'emissionsDataCache';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24h

export interface EmissionsData {
  [country: string]: {
    iso_code: string;
    year: number;
    population: number;
    co2: number;
    co2_per_capita: number;
    share_global_co2: number;
    temperature_change_from_co2: number;
  };
}

/**
 * Loads emissions data.
 * 1️⃣ Try to load cached data (if fresh).
 * 2️⃣ Attempt live API fetch.
 * 3️⃣ Fallback to bundled local JSON.
 */
export const useEmissionsData = () => {
  const [data, setData] = useState<EmissionsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadFromCache = () => {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { timestamp, payload } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_TTL_MS) {
            return payload as EmissionsData;
          }
        } catch {}
      }
      return null;
    };

    const saveToCache = (payload: EmissionsData) => {
      const entry = { timestamp: Date.now(), payload };
      localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
    };

    const fetchLive = async (): Promise<EmissionsData | null> => {
      try {
        const res = await fetch(LIVE_EMISSIONS_API);
        if (!res.ok) return null;
        const json = await res.json();
        // World Bank returns an array: [metadata, dataArray]
        const dataArray = json[1] ?? [];
        const transformed: EmissionsData = {};
        dataArray.forEach((item: any) => {
          const country = item.country?.value || item.countryiso3code || 'UNKNOWN';
          transformed[country] = {
            iso_code: item.country?.id || 'XX',
            year: item.date ? parseInt(item.date) : 0,
            population: 0, // not provided in this endpoint
            co2: 0, // not provided; could be approximated later
            co2_per_capita: item.value ?? 0,
            share_global_co2: 0,
            temperature_change_from_co2: 0,
          };
        });
        return transformed;
      } catch (e) {
        console.warn('Live emissions fetch failed', e);
        return null;
      }
    };

    const load = async () => {
      const cached = loadFromCache();
      if (cached) {
        if (isMounted) setData(cached);
        setIsLoading(false);
        return;
      }
      const live = await fetchLive();
      if (live) {
        saveToCache(live);
        if (isMounted) setData(live);
        setIsLoading(false);
        return;
      }
      // Fallback to local JSON
      try {
        const res = await fetch(LOCAL_EMISSIONS_FILE);
        if (res.ok) {
          const json = await res.json();
          if (isMounted) setData(json);
        }
      } catch (e) {
        console.warn('Failed to load local emissions.json', e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading };
};
