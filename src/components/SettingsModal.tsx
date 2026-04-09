'use client';

import type { Alarm } from '@/hooks/useAlarms';
import { COLORS } from '@/lib/colors';

interface Props {
  visible: boolean;
  colorIdx: number;
  alarms: Alarm[];
  onClose: () => void;
  onColorChange: (idx: number) => void;
  onAlarmTime: (idx: number, time: string) => void;
  onAlarmToggle: (idx: number) => void;
  getLocalDisplay: (alarm: Alarm) => string;
}

export default function SettingsModal({
  visible,
  colorIdx,
  alarms,
  onClose,
  onColorChange,
  onAlarmTime,
  onAlarmToggle,
  getLocalDisplay,
}: Props) {
  return (
    <div
      className={`modal-overlay${visible ? ' visible' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="settings-panel">
        <div>
          <div className="settings-section-title">Display colour</div>
          <div className="swatch-row">
            {COLORS.map((color, i) => (
              <div
                key={color.name}
                className={`swatch${colorIdx === i ? ' active' : ''}`}
                style={{
                  background: color.main,
                  boxShadow: `0 0 8px ${color.glow1}`,
                }}
                title={color.name}
                onClick={() => onColorChange(i)}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="settings-section-title">
            Alarms (device local time)
          </div>
          <div className="alarm-rows">
            {alarms.map((alarm, i) => (
              <div key={i} className="alarm-row">
                <div className="alarm-label">Alarm {i + 1}</div>
                <input
                  className="alarm-time-input"
                  type="time"
                  value={alarm.localTime}
                  onChange={(e) => onAlarmTime(i, e.target.value)}
                />
                <div
                  className={`alarm-toggle${alarm.enabled ? ' on' : ''}`}
                  onClick={() => onAlarmToggle(i)}
                />
                <div className={`alarm-local${alarm.enabled ? ' active' : ''}`}>
                  {getLocalDisplay(alarm)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="settings-close" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
