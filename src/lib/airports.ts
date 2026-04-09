export interface Airport {
  city: string;
  tz: string;
}

export type AirportDB = Record<string, Airport>;

interface AirportRecord {
  iata?: string;
  city?: string;
  name?: string;
  tz?: string;
}

export const FALLBACK: AirportDB = {
  WAW: { city: 'Warsaw', tz: 'Europe/Warsaw' },
  JFK: { city: 'New York', tz: 'America/New_York' },
  BER: { city: 'Berlin', tz: 'Europe/Berlin' },
  LHR: { city: 'London', tz: 'Europe/London' },
  CDG: { city: 'Paris', tz: 'Europe/Paris' },
  LAX: { city: 'Los Angeles', tz: 'America/Los_Angeles' },
  DXB: { city: 'Dubai', tz: 'Asia/Dubai' },
  NRT: { city: 'Tokyo', tz: 'Asia/Tokyo' },
  SYD: { city: 'Sydney', tz: 'Australia/Sydney' },
  SIN: { city: 'Singapore', tz: 'Asia/Singapore' },
  AMS: { city: 'Amsterdam', tz: 'Europe/Amsterdam' },
  HKG: { city: 'Hong Kong', tz: 'Asia/Hong_Kong' },
  ORD: { city: 'Chicago', tz: 'America/Chicago' },
  ICN: { city: 'Seoul', tz: 'Asia/Seoul' },
  GRU: { city: 'São Paulo', tz: 'America/Sao_Paulo' },
};

export async function fetchAirportDB(): Promise<{
  db: AirportDB;
  count: number;
  offline: boolean;
}> {
  try {
    const res = await fetch(
      'https://raw.githubusercontent.com/mwgg/Airports/master/airports.json',
    );
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const data = (await res.json()) as Record<string, AirportRecord>;
    const db: AirportDB = {};

    for (const airport of Object.values(data)) {
      const iata = airport.iata?.trim() ?? '';
      if (iata && iata.length === 3 && airport.tz) {
        db[iata] = {
          city: airport.city ?? airport.name ?? iata,
          tz: airport.tz,
        };
      }
    }

    return { db, count: Object.keys(db).length, offline: false };
  } catch {
    return {
      db: { ...FALLBACK },
      count: Object.keys(FALLBACK).length,
      offline: true,
    };
  }
}

export function lookupIATA(code: string, db: AirportDB): Airport | null {
  const key = code.toUpperCase().trim();
  return db[key] ?? FALLBACK[key] ?? null;
}
