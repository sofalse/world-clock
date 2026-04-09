'use client';

import { useEffect, useRef, useState } from 'react';

import { lookupIATA } from '@/lib/airports';
import type { AirportDB } from '@/lib/airports';

interface Props {
  panelIdx: number | null;
  hour12: boolean;
  currentIata: string;
  currentCity: string;
  currentTz: string;
  db: AirportDB;
  dbLoaded: boolean;
  onConfirm: (idx: number, iata: string, city: string, tz: string) => void;
  onFormatChange: (idx: number, hour12: boolean) => void;
  onClose: () => void;
}

export default function IATAModal({
  panelIdx,
  hour12,
  currentIata,
  currentCity,
  currentTz,
  db,
  dbLoaded,
  onConfirm,
  onFormatChange,
  onClose,
}: Props) {
  const [value, setValue] = useState(currentIata);
  const [status, setStatus] = useState<{ text: string; cls: string }>({
    text: dbLoaded ? `${currentCity} • ${currentTz}` : 'Loading database...',
    cls: dbLoaded ? 'ok' : '',
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const visible = panelIdx !== null;

  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    const focusInput = () => inputRef.current?.focus({ preventScroll: true });
    focusInput();
    const timeoutId = window.setTimeout(focusInput, 50);

    return () => window.clearTimeout(timeoutId);
  }, [visible]);

  function handleInput(raw: string) {
    const code = raw.toUpperCase();
    setValue(code);

    if (code.length < 3) {
      setStatus({ text: '', cls: '' });
      return;
    }

    const zone = lookupIATA(code, db);
    if (zone) {
      setStatus({ text: `${zone.city} • ${zone.tz}`, cls: 'ok' });
      return;
    }

    setStatus({ text: 'Unknown IATA code', cls: 'err' });
  }

  function confirm() {
    if (panelIdx === null) {
      return;
    }

    const code = value.toUpperCase().trim();
    if (!code || code === currentIata) {
      onClose();
      return;
    }

    const zone = lookupIATA(code, db);
    if (zone) {
      onConfirm(panelIdx, code, zone.city, zone.tz);
      setStatus({ text: `${zone.city} • ${zone.tz}`, cls: 'ok' });
      window.setTimeout(onClose, 700);
      return;
    }

    setStatus({ text: 'Unknown IATA code', cls: 'err' });
    inputRef.current?.focus();
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      confirm();
    }
    if (e.key === 'Escape') {
      onClose();
    }
  }

  return (
    <div
      className={`modal-overlay${visible ? ' visible' : ''}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="modal">
        <div className="modal-title">Clock settings</div>
        <input
          ref={inputRef}
          className="modal-input"
          maxLength={3}
          placeholder="WAW"
          autoFocus
          spellCheck={false}
          autoComplete="off"
          value={value}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={onKey}
        />
        <div className="modal-section">
          <div className="settings-section-title">Time format</div>
          <div className="toggle-row">
            <button
              className={`toggle-btn${!hour12 ? ' active' : ''}`}
              onClick={() =>
                panelIdx !== null && onFormatChange(panelIdx, false)
              }
            >
              24h
            </button>
            <button
              className={`toggle-btn${hour12 ? ' active' : ''}`}
              onClick={() =>
                panelIdx !== null && onFormatChange(panelIdx, true)
              }
            >
              12h
            </button>
          </div>
        </div>
        <div className={`modal-status${status.cls ? ` ${status.cls}` : ''}`}>
          {status.text}
        </div>
        <div className="modal-btns">
          <button className="modal-btn" onClick={onClose}>
            Cancel
          </button>
          <button className="modal-btn confirm" onClick={confirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
