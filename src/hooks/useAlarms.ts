'use client'
import { useState, useEffect, useRef } from 'react'

export interface Alarm {
  enabled: boolean
  utcMinutes: number  // stored in UTC
  localTime: string   // "HH:MM" in device local time (display only)
}

function localTimeToUTCMinutes(timeStr: string): number {
  const [h, m] = timeStr.split(':').map(Number)
  const now = new Date()
  const local = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0)
  return local.getUTCHours() * 60 + local.getUTCMinutes()
}

function utcMinutesToLocalStr(utcMin: number): string {
  const now = new Date()
  const utcMs = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(),
    Math.floor(utcMin / 60), utcMin % 60, 0)
  const local = new Date(utcMs)
  return `${String(local.getHours()).padStart(2, '0')}:${String(local.getMinutes()).padStart(2, '0')}`
}

function twoBeeps() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    const beep = (delay: number) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.value = 880
      gain.gain.setValueAtTime(0, ctx.currentTime + delay)
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + delay + 0.01)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + 0.12)
      osc.start(ctx.currentTime + delay)
      osc.stop(ctx.currentTime + delay + 0.13)
    }
    beep(0)
    beep(0.2)
  } catch {}
}

export function useAlarms() {
  const [alarms, setAlarms] = useState<Alarm[]>([
    { enabled: false, utcMinutes: 8 * 60,  localTime: '08:00' },
    { enabled: false, utcMinutes: 20 * 60, localTime: '20:00' },
  ])
  const lastBeepMinute = useRef<number[]>([-1, -1])

  useEffect(() => {
    const id = setInterval(() => {
      const now = new Date()
      const utcMin = now.getUTCHours() * 60 + now.getUTCMinutes()
      setAlarms(prev => {
        prev.forEach((a, i) => {
          if (a.enabled && a.utcMinutes === utcMin && lastBeepMinute.current[i] !== utcMin) {
            lastBeepMinute.current[i] = utcMin
            twoBeeps()
          }
        })
        return prev
      })
    }, 10_000)
    return () => clearInterval(id)
  }, [])

  function setAlarmTime(idx: number, localTime: string) {
    setAlarms(prev => prev.map((a, i) =>
      i === idx ? { ...a, localTime, utcMinutes: localTimeToUTCMinutes(localTime) } : a
    ))
  }

  function toggleAlarm(idx: number) {
    setAlarms(prev => prev.map((a, i) =>
      i === idx ? { ...a, enabled: !a.enabled } : a
    ))
  }

  function getLocalDisplay(a: Alarm) {
    return a.enabled ? utcMinutesToLocalStr(a.utcMinutes) : ''
  }

  return { alarms, setAlarmTime, toggleAlarm, getLocalDisplay }
}
