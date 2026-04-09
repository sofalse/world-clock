'use client'
import { useState, useEffect } from 'react'

export interface ClockPanel {
  iata: string
  city: string
  tz: string
}

function formatTime(tz: string, hour12: boolean) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit', minute: '2-digit', hour12, timeZone: tz,
  }).formatToParts(new Date())
  const h = parts.find(p => p.type === 'hour')!.value
  const m = parts.find(p => p.type === 'minute')!.value
  const period = parts.find(p => p.type === 'dayPeriod')?.value.toUpperCase() ?? ''
  return { h, m, period }
}

function formatDate(tz: string) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short', day: '2-digit', month: '2-digit', timeZone: tz,
  }).formatToParts(new Date())
  const wd  = parts.find(p => p.type === 'weekday')!.value.toUpperCase()
  const day = parts.find(p => p.type === 'day')!.value
  const mon = parts.find(p => p.type === 'month')!.value
  return `${wd} ${day}.${mon}`
}

export function useClock(panels: ClockPanel[], hour12: boolean) {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000)
    return () => clearInterval(id)
  }, [])

  return panels.map(p => ({
    ...formatTime(p.tz, hour12),
    date: formatDate(p.tz),
    iata: p.iata,
    city: p.city,
  }))
}
