'use client'

import { useEffect, useRef } from 'react'

import { useWorldClockStore } from '@/stores/useWorldClockStore'

export interface Alarm {
  enabled: boolean
  localTime: string
}

interface BrowserAudioWindow extends Window {
  webkitAudioContext?: typeof AudioContext
}

function twoBeeps() {
  try {
    const AudioContextCtor =
      window.AudioContext ?? (window as BrowserAudioWindow).webkitAudioContext
    if (!AudioContextCtor) {
      return
    }

    const ctx = new AudioContextCtor()

    const playFanfareNote = (freq: number, delay: number, duration: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.connect(gain)
      gain.connect(ctx.destination)

      osc.type = 'sawtooth'
      osc.frequency.value = freq

      const startTime = ctx.currentTime + delay

      gain.gain.setValueAtTime(0, startTime)
      gain.gain.linearRampToValueAtTime(0.2, startTime + 0.05)
      gain.gain.setValueAtTime(0.2, startTime + duration - 0.1)
      gain.gain.linearRampToValueAtTime(0, startTime + duration)

      osc.start(startTime)
      osc.stop(startTime + duration)
    }

    // C5 -> E5 -> G5 -> C6
    playFanfareNote(523.25, 0.0, 0.15) // C5
    playFanfareNote(659.25, 0.15, 0.15) // E5
    playFanfareNote(783.99, 0.3, 0.15) // G5
    playFanfareNote(1046.5, 0.45, 0.6) // C6
  } catch {
    // Ignore audio API failures on unsupported devices or blocked contexts.
  }
}

export function useAlarms() {
  const alarms = useWorldClockStore((state) => state.alarms)
  const setStoredAlarmTime = useWorldClockStore((state) => state.setAlarmTime)
  const toggleStoredAlarm = useWorldClockStore((state) => state.toggleAlarm)
  const lastTriggerKey = useRef<string[]>(['', ''])

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date()
      const localTime = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes(),
      ).padStart(2, '0')}`
      const triggerKey = `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}-${localTime}`

      alarms.forEach((alarm, i) => {
        if (
          alarm.enabled &&
          alarm.localTime === localTime &&
          lastTriggerKey.current[i] !== triggerKey
        ) {
          lastTriggerKey.current[i] = triggerKey
          twoBeeps()
        }
      })
    }, 10_000)

    return () => clearInterval(id)
  }, [alarms])

  function setAlarmTime(idx: number, localTime: string) {
    setStoredAlarmTime(idx, localTime)
  }

  function toggleAlarm(idx: number) {
    toggleStoredAlarm(idx)
  }
  return { alarms, setAlarmTime, toggleAlarm }
}
