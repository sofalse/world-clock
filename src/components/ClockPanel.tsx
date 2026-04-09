'use client';
import { useRef } from 'react';

interface Props {
  idx: number;
  h: string;
  m: string;
  period: string;
  reservePeriodSpace: boolean;
  date: string;
  iata: string;
  city: string;
  editing: boolean;
  onContextMenu: (idx: number) => void;
  onLongPress: (idx: number) => void;
}

export default function ClockPanel({
  idx,
  h,
  m,
  period,
  reservePeriodSpace,
  date,
  iata,
  city,
  editing,
  onContextMenu,
  onLongPress,
}: Props) {
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressReadyRef = useRef(false);

  function clearLongPress() {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  }

  return (
    <div
      className={`clock-panel${editing ? ' editing' : ''}`}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(idx);
      }}
      onTouchStart={() => {
        longPressReadyRef.current = false;
        clearLongPress();
        longPressTimerRef.current = setTimeout(() => {
          longPressTimerRef.current = null;
          longPressReadyRef.current = true;
        }, 500);
      }}
      onTouchEnd={() => {
        clearLongPress();
        if (longPressReadyRef.current) {
          longPressReadyRef.current = false;
          onLongPress(idx);
        }
      }}
      onTouchMove={() => {
        longPressReadyRef.current = false;
        clearLongPress();
      }}
    >
      <div className="city-label">{city}</div>
      <div className="segment-wrap">
        <div className="segment-display" suppressHydrationWarning>
          <span className="time-main" suppressHydrationWarning>
            {h}
            <span className="colon">:</span>
            {m}
          </span>
          {reservePeriodSpace && (
            <span
              className={`period${period ? '' : ' period-empty'}`}
              suppressHydrationWarning
            >
              {period || 'PM'}
            </span>
          )}
        </div>
      </div>
      <div className="date-display" suppressHydrationWarning>
        {date}
      </div>
      <div className="iata-display">{iata}</div>
    </div>
  );
}
