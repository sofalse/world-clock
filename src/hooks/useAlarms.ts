'use client';

import { useEffect, useRef } from 'react';

import { useWorldClockStore } from '@/stores/useWorldClockStore';

export interface Alarm {
  enabled: boolean;
  utcMinutes: number;
  localTime: string;
}

interface BrowserAudioWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
}

function localTimeToUTCMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number);
  const now = new Date();
  const local = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    h,
    m,
    0,
  );
  return local.getUTCHours() * 60 + local.getUTCMinutes();
}

function utcMinutesToLocalStr(utcMin: number): string {
  const now = new Date();
  const utcMs = Date.UTC(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    Math.floor(utcMin / 60),
    utcMin % 60,
    0,
  );
  const local = new Date(utcMs);
  return `${String(local.getHours()).padStart(2, '0')}:${String(local.getMinutes()).padStart(2, '0')}`;
}

function twoBeeps() {
  try {
    const AudioContextCtor =
      window.AudioContext ?? (window as BrowserAudioWindow).webkitAudioContext;
    if (!AudioContextCtor) {
      return;
    }

    const ctx = new AudioContextCtor();
    const beep = (delay: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + delay + 0.01);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + 0.12);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.13);
    };

    beep(0);
    beep(0.2);
  } catch {
    // Ignore audio API failures on unsupported devices or blocked contexts.
  }
}

export function useAlarms() {
  const alarms = useWorldClockStore((state) => state.alarms);
  const setStoredAlarmTime = useWorldClockStore((state) => state.setAlarmTime);
  const toggleStoredAlarm = useWorldClockStore((state) => state.toggleAlarm);
  const lastBeepMinute = useRef<number[]>([-1, -1]);

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      const utcMin = now.getUTCHours() * 60 + now.getUTCMinutes();

      alarms.forEach((alarm, i) => {
        if (
          alarm.enabled &&
          alarm.utcMinutes === utcMin &&
          lastBeepMinute.current[i] !== utcMin
        ) {
          lastBeepMinute.current[i] = utcMin;
          twoBeeps();
        }
      });
    }, 10_000);

    return () => clearInterval(id);
  }, [alarms]);

  function setAlarmTime(idx: number, localTime: string) {
    setStoredAlarmTime(idx, localTime, localTimeToUTCMinutes(localTime));
  }

  function toggleAlarm(idx: number) {
    toggleStoredAlarm(idx);
  }

  function getLocalDisplay(alarm: Alarm) {
    return alarm.enabled ? utcMinutesToLocalStr(alarm.utcMinutes) : '';
  }

  return { alarms, setAlarmTime, toggleAlarm, getLocalDisplay };
}
