import { useState, useEffect } from 'react';

// Simple offline‑first hook: loads emissions data from the bundled public file.
const LOCAL_EMISSIONS_FILE = '/emissions.json';

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

export const useEmissionsData = () => {
  const [data, setData] = useState<EmissionsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const res = await fetch(LOCAL_EMISSIONS_FILE);
        if (res.ok) {
          const json = await res.json();
          if (isMounted) setData(json);
        }
      } catch (e) {
        console.warn('Failed to load emissions.json', e);
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
