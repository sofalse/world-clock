'use client'
import { useState, useCallback, Fragment } from 'react'
import { COLORS } from '@/lib/colors'
import { useAirportDB } from '@/hooks/useAirportDB'
import { useClock, type ClockPanel as ClockPanelData } from '@/hooks/useClock'
import { useAlarms } from '@/hooks/useAlarms'
import { useScale } from '@/hooks/useScale'
import ClockPanel from '@/components/ClockPanel'
import IATAModal from '@/components/IATAModal'
import SettingsModal from '@/components/SettingsModal'

export default function Home() {
  const { db, loaded, badge } = useAirportDB()
  const { alarms, setAlarmTime, toggleAlarm, getLocalDisplay } = useAlarms()
  useScale('scale-root')

  const [panels, setPanels] = useState<ClockPanelData[]>([
    { iata: 'WAW', city: 'Warsaw',   tz: 'Europe/Warsaw' },
    { iata: 'JFK', city: 'New York', tz: 'America/New_York' },
  ])
  const [hour12, setHour12] = useState(false)
  const [colorIdx, setColorIdx] = useState(0)
  const [editingPanel, setEditingPanel] = useState<number | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const times = useClock(panels, hour12)

  const applyColor = useCallback((idx: number) => {
    setColorIdx(idx)
    const c = COLORS[idx]
    const r = document.documentElement.style
    r.setProperty('--clr-main',    c.main)
    r.setProperty('--clr-sub',     c.sub)
    r.setProperty('--clr-glow1',   c.glow1)
    r.setProperty('--clr-glow2',   c.glow2)
    r.setProperty('--clr-subglow', c.subglow)
    r.setProperty('--clr-ghost',   c.ghost)
  }, [])

  function handleIATAConfirm(idx: number, iata: string, city: string, tz: string) {
    setPanels(prev => prev.map((p, i) => i === idx ? { iata, city, tz } : p))
  }

  return (
    <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      <div id="scale-root">
        <div className="outer-frame">
          <div className="frame-header">
            <div className={`led-dot${loaded ? '' : ' loading'}`} />
            <div className="frame-title" onClick={() => setSettingsOpen(true)}>
              World Time
            </div>
            <div className={`led-dot${loaded ? '' : ' loading'}`} />
          </div>

          <div className="clocks-row">
            {panels.map((_, i) => (
              <Fragment key={i}>
                {i > 0 && <div className="divider" />}
                <ClockPanel
                  idx={i}
                  h={times[i].h}
                  m={times[i].m}
                  period={times[i].period}
                  date={times[i].date}
                  iata={times[i].iata}
                  city={times[i].city}
                  editing={editingPanel === i}
                  onContextMenu={setEditingPanel}
                  onLongPress={setEditingPanel}
                />
              </Fragment>
            ))}
          </div>

          <div className="hint">
            Right-click / long-press a zone to change IATA &nbsp;·&nbsp; click title for settings
          </div>
          <div className="db-badge">{badge}</div>
        </div>
      </div>

      <IATAModal
        panelIdx={editingPanel}
        db={db}
        dbLoaded={loaded}
        onConfirm={handleIATAConfirm}
        onClose={() => setEditingPanel(null)}
      />

      <SettingsModal
        visible={settingsOpen}
        colorIdx={colorIdx}
        hour12={hour12}
        alarms={alarms}
        onClose={() => setSettingsOpen(false)}
        onColorChange={applyColor}
        onFormatChange={setHour12}
        onAlarmTime={setAlarmTime}
        onAlarmToggle={toggleAlarm}
        getLocalDisplay={getLocalDisplay}
      />
    </main>
  )
}
