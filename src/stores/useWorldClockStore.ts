'use client';

import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { Alarm } from '@/hooks/useAlarms';
import type { ClockPanel } from '@/hooks/useClock';

const DEFAULT_PANELS: ClockPanel[] = [
  { iata: 'WAW', city: 'Warsaw', tz: 'Europe/Warsaw', hour12: false },
  { iata: 'JFK', city: 'New York', tz: 'America/New_York', hour12: false },
];

const DEFAULT_ALARMS: Alarm[] = [
  { enabled: false, utcMinutes: 8 * 60, localTime: '08:00' },
  { enabled: false, utcMinutes: 20 * 60, localTime: '20:00' },
];

interface WorldClockState {
  panels: ClockPanel[];
  colorIdx: number;
  alarms: Alarm[];
  hasHydrated: boolean;
  setHasHydrated: (hasHydrated: boolean) => void;
  setColorIdx: (colorIdx: number) => void;
  updatePanelIata: (
    idx: number,
    iata: string,
    city: string,
    tz: string,
  ) => void;
  updatePanelFormat: (idx: number, hour12: boolean) => void;
  setAlarmTime: (idx: number, localTime: string, utcMinutes: number) => void;
  toggleAlarm: (idx: number) => void;
}

export const useWorldClockStore = create<WorldClockState>()(
  persist(
    (set) => ({
      panels: DEFAULT_PANELS,
      colorIdx: 0,
      alarms: DEFAULT_ALARMS,
      hasHydrated: false,
      setHasHydrated: (hasHydrated) => set({ hasHydrated }),
      setColorIdx: (colorIdx) => set({ colorIdx }),
      updatePanelIata: (idx, iata, city, tz) =>
        set((state) => ({
          panels: state.panels.map((panel, i) =>
            i === idx ? { ...panel, iata, city, tz } : panel,
          ),
        })),
      updatePanelFormat: (idx, hour12) =>
        set((state) => ({
          panels: state.panels.map((panel, i) =>
            i === idx ? { ...panel, hour12 } : panel,
          ),
        })),
      setAlarmTime: (idx, localTime, utcMinutes) =>
        set((state) => ({
          alarms: state.alarms.map((alarm, i) =>
            i === idx ? { ...alarm, localTime, utcMinutes } : alarm,
          ),
        })),
      toggleAlarm: (idx) =>
        set((state) => ({
          alarms: state.alarms.map((alarm, i) =>
            i === idx ? { ...alarm, enabled: !alarm.enabled } : alarm,
          ),
        })),
    }),
    {
      name: 'world-clock-store-v1',
      partialize: (state) => ({
        panels: state.panels,
        colorIdx: state.colorIdx,
        alarms: state.alarms,
      }),
      skipHydration: true,
    },
  ),
);

export function useHydrateWorldClockStore() {
  const hasHydrated = useWorldClockStore((state) => state.hasHydrated);

  useEffect(() => {
    const persistApi = useWorldClockStore.persist;
    if (persistApi.hasHydrated()) {
      useWorldClockStore.getState().setHasHydrated(true);
      return;
    }

    const unsubscribe = persistApi.onFinishHydration(() => {
      useWorldClockStore.getState().setHasHydrated(true);
    });

    void persistApi.rehydrate();

    return unsubscribe;
  }, []);

  return hasHydrated;
}
