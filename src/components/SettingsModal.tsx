'use client'
import { COLORS } from '@/lib/colors'
import { type Alarm } from '@/hooks/useAlarms'

interface Props {
  visible: boolean
  colorIdx: number
  hour12: boolean
  alarms: Alarm[]
  onClose: () => void
  onColorChange: (idx: number) => void
  onFormatChange: (h12: boolean) => void
  onAlarmTime: (idx: number, time: string) => void
  onAlarmToggle: (idx: number) => void
  getLocalDisplay: (a: Alarm) => string
}

export default function SettingsModal({
  visible, colorIdx, hour12, alarms,
  onClose, onColorChange, onFormatChange,
  onAlarmTime, onAlarmToggle, getLocalDisplay,
}: Props) {
  return (
    <div
      className={`modal-overlay${visible ? ' visible' : ''}`}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="settings-panel">

        {/* Colour */}
        <div>
          <div className="settings-section-title">Display colour</div>
          <div className="swatch-row">
            {COLORS.map((c, i) => (
              <div
                key={c.name}
                className={`swatch${colorIdx === i ? ' active' : ''}`}
                style={{ background: c.main, boxShadow: `0 0 8px ${c.glow1}` }}
                title={c.name}
                onClick={() => onColorChange(i)}
              />
            ))}
          </div>
        </div>

        {/* Format */}
        <div>
          <div className="settings-section-title">Time format</div>
          <div className="toggle-row">
            <button className={`toggle-btn${!hour12 ? ' active' : ''}`} onClick={() => onFormatChange(false)}>24h</button>
            <button className={`toggle-btn${hour12  ? ' active' : ''}`} onClick={() => onFormatChange(true)}>12h</button>
          </div>
        </div>

        {/* Alarms */}
        <div>
          <div className="settings-section-title">Alarms (device local time)</div>
          <div className="alarm-rows">
            {alarms.map((a, i) => (
              <div key={i} className="alarm-row">
                <div className="alarm-label">Alarm {i + 1}</div>
                <input
                  className="alarm-time-input"
                  type="time"
                  value={a.localTime}
                  onChange={e => onAlarmTime(i, e.target.value)}
                />
                <div
                  className={`alarm-toggle${a.enabled ? ' on' : ''}`}
                  onClick={() => onAlarmToggle(i)}
                />
                <div className={`alarm-local${a.enabled ? ' active' : ''}`}>
                  {getLocalDisplay(a)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="settings-close" onClick={onClose}>Close</button>
      </div>
    </div>
  )
}
