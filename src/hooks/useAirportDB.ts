'use client';

import { useEffect, useState } from 'react';

import { fetchAirportDB } from '@/lib/airports';
import type { AirportDB } from '@/lib/airports';

export function useAirportDB() {
  const [db, setDb] = useState<AirportDB>({});
  const [loaded, setLoaded] = useState(false);
  const [badge, setBadge] = useState('Loading airport database...');

  useEffect(() => {
    fetchAirportDB().then(({ db: nextDb, count, offline }) => {
      setDb(nextDb);
      setLoaded(true);
      setBadge(
        offline
          ? `Offline mode — ${count} airports`
          : `Database: ${count.toLocaleString()} airports`,
      );
    });
  }, []);

  return { db, loaded, badge };
}
