'use client'

interface Props {
  idx: number
  h: string
  m: string
  period: string
  date: string
  iata: string
  city: string
  editing: boolean
  onContextMenu: (idx: number) => void
  onLongPress: (idx: number) => void
}

export default function ClockPanel({ idx, h, m, period, date, iata, city, editing, onContextMenu, onLongPress }: Props) {
  let longPressTimer: ReturnType<typeof setTimeout> | null = null

  return (
    <div
      className={`clock-panel${editing ? ' editing' : ''}`}
      onContextMenu={e => { e.preventDefault(); onContextMenu(idx) }}
      onTouchStart={() => { longPressTimer = setTimeout(() => { longPressTimer = null; onLongPress(idx) }, 500) }}
      onTouchEnd={() => { if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null } }}
      onTouchMove={() => { if (longPressTimer) { clearTimeout(longPressTimer); longPressTimer = null } }}
    >
      <div className="city-label">{city}</div>
      <div className="segment-wrap">
        <div className="segment-ghost">88<span>:</span>88</div>
        <div className="segment-display">
          {h}<span className="colon">:</span>{m}
          {period && <span className="period">{period}</span>}
        </div>
      </div>
      <div className="date-display">{date}</div>
      <div className="iata-display">{iata}</div>
    </div>
  )
}
