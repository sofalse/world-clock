'use client'
import { useState, useEffect } from 'react'
import { fetchAirportDB, type AirportDB } from '@/lib/airports'

export function useAirportDB() {
  const [db, setDb] = useState<AirportDB>({})
  const [loaded, setLoaded] = useState(false)
  const [badge, setBadge] = useState('Loading airport database...')

  useEffect(() => {
    fetchAirportDB().then(({ db, count, offline }) => {
      setDb(db)
      setLoaded(true)
      setBadge(offline
        ? `Offline mode — ${count} airports`
        : `Database: ${count.toLocaleString()} airports`)
    })
  }, [])

  return { db, loaded, badge }
}
