'use client';

import { useEffect, useRef } from 'react';

import { useWorldClockStore } from '@/stores/useWorldClockStore';

export interface Alarm {
  enabled: boolean;
  localTime: string;
}

interface BrowserAudioWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
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
      gain.gain.linearRampToValueAtTime(0.8, ctx.currentTime + delay + 0.01);
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
  const lastTriggerKey = useRef<string[]>(['', '']);

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date();
      const localTime = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes(),
      ).padStart(2, '0')}`;
      const triggerKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${localTime}`;

      alarms.forEach((alarm, i) => {
        if (
          alarm.enabled &&
          alarm.localTime === localTime &&
          lastTriggerKey.current[i] !== triggerKey
        ) {
          lastTriggerKey.current[i] = triggerKey;
          twoBeeps();
        }
      });
    }, 10_000);

    return () => clearInterval(id);
  }, [alarms]);

  function setAlarmTime(idx: number, localTime: string) {
    setStoredAlarmTime(idx, localTime);
  }

  function toggleAlarm(idx: number) {
    toggleStoredAlarm(idx);
  }
  return { alarms, setAlarmTime, toggleAlarm };
}
