'use client';

import { useEffect, useState } from 'react';

export interface ClockPanel {
  iata: string;
  city: string;
  tz: string;
  hour12: boolean;
}

function formatTime(tz: string, hour12: boolean) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12,
    timeZone: tz,
  }).formatToParts(new Date());

  const h = parts.find((part) => part.type === 'hour')?.value ?? '00';
  const m = parts.find((part) => part.type === 'minute')?.value ?? '00';
  const period =
    parts.find((part) => part.type === 'dayPeriod')?.value.toUpperCase() ?? '';

  return { h, m, period };
}

function formatDate(tz: string) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    timeZone: tz,
  }).formatToParts(new Date());

  const weekday =
    parts.find((part) => part.type === 'weekday')?.value.toUpperCase() ?? '';
  const day = parts.find((part) => part.type === 'day')?.value ?? '00';
  const month = parts.find((part) => part.type === 'month')?.value ?? '00';

  return `${weekday} ${day}.${month}`;
}

export function useClock(panels: ClockPanel[]) {
  const [_tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((tick) => tick + 1), 1000);
    return () => clearInterval(id);
  }, []);

  return panels.map((panel) => ({
    ...formatTime(panel.tz, panel.hour12),
    date: formatDate(panel.tz),
    iata: panel.iata,
    city: panel.city,
    hour12: panel.hour12,
  }));
}
