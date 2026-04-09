'use client';

import { signOut, useSession } from 'next-auth/react';
import { Fragment, useCallback, useEffect, useState } from 'react';

import ClockPanel from '@/components/ClockPanel';
import IATAModal from '@/components/IATAModal';
import SettingsModal from '@/components/SettingsModal';
import { useAirportDB } from '@/hooks/useAirportDB';
import { useAlarms } from '@/hooks/useAlarms';
import { useClock } from '@/hooks/useClock';
import { useScale } from '@/hooks/useScale';
import { COLORS } from '@/lib/colors';
import {
  useHydrateWorldClockStore,
  useWorldClockStore,
} from '@/stores/useWorldClockStore';

export default function Home() {
  const { db, loaded, badge } = useAirportDB();
  const { alarms, setAlarmTime, toggleAlarm } = useAlarms();
  const { data: session, status } = useSession();
  useScale('scale-root');
  useHydrateWorldClockStore();

  const panels = useWorldClockStore((state) => state.panels);
  const colorIdx = useWorldClockStore((state) => state.colorIdx);
  const setColorIdx = useWorldClockStore((state) => state.setColorIdx);
  const updatePanelIata = useWorldClockStore((state) => state.updatePanelIata);
  const updatePanelFormat = useWorldClockStore(
    (state) => state.updatePanelFormat,
  );

  const [editingPanel, setEditingPanel] = useState<number | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const times = useClock(panels);
  const reservePeriodSpace = panels.some((panel) => panel.hour12);

  const applyColor = useCallback(
    (idx: number) => {
      setColorIdx(Math.max(0, Math.min(idx, COLORS.length - 1)));
    },
    [setColorIdx],
  );

  useEffect(() => {
    const c = COLORS[colorIdx];
    const r = document.documentElement.style;
    r.setProperty('--clr-main', c.main);
    r.setProperty('--clr-sub', c.sub);
    r.setProperty('--clr-glow1', c.glow1);
    r.setProperty('--clr-glow2', c.glow2);
    r.setProperty('--clr-subglow', c.subglow);
    r.setProperty('--clr-ghost', c.ghost);
  }, [colorIdx]);

  function handleIATAConfirm(
    idx: number,
    iata: string,
    city: string,
    tz: string,
  ) {
    updatePanelIata(idx, iata, city, tz);
  }

  function handleFormatChange(idx: number, hour12: boolean) {
    updatePanelFormat(idx, hour12);
  }

  const editingPanelData = editingPanel !== null ? panels[editingPanel] : null;
  const modalKey = editingPanelData
    ? `${editingPanel}:${editingPanelData.iata}:${editingPanelData.tz}:${Number(loaded)}`
    : 'closed';
  const fullName = session?.user?.name?.trim();
  const titleLabel =
    status === 'authenticated' && fullName
      ? `World Time • ${fullName}`
      : 'World Time';

  return (
    <main
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <div id="scale-root">
        <div className="outer-frame">
          <div className="frame-header">
            <div
              className={`led-dot${alarms[0]?.enabled ? ' active' : ''}`}
              aria-label={
                alarms[0]?.enabled ? 'Alarm 1 active' : 'Alarm 1 inactive'
              }
              title={alarms[0]?.enabled ? 'Alarm 1 active' : 'Alarm 1 inactive'}
            />
            <div className="frame-title" onClick={() => setSettingsOpen(true)}>
              {titleLabel}
            </div>
            <div
              className={`led-dot${alarms[1]?.enabled ? ' active' : ''}`}
              aria-label={
                alarms[1]?.enabled ? 'Alarm 2 active' : 'Alarm 2 inactive'
              }
              title={alarms[1]?.enabled ? 'Alarm 2 active' : 'Alarm 2 inactive'}
            />
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
                  reservePeriodSpace={reservePeriodSpace}
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
            Right-click / long-press a zone to change IATA &nbsp;·&nbsp; click
            title for settings
          </div>
          <div className="db-badge">{badge}</div>
          {status === 'authenticated' && (
            <div className="logout-section">
              <button
                className="frame-logout"
                type="button"
                onClick={() => void signOut()}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <IATAModal
        key={modalKey}
        panelIdx={editingPanel}
        hour12={editingPanelData?.hour12 ?? false}
        currentIata={editingPanelData?.iata ?? ''}
        currentCity={editingPanelData?.city ?? ''}
        currentTz={editingPanelData?.tz ?? ''}
        db={db}
        dbLoaded={loaded}
        onConfirm={handleIATAConfirm}
        onFormatChange={handleFormatChange}
        onClose={() => setEditingPanel(null)}
      />

      <SettingsModal
        visible={settingsOpen}
        colorIdx={colorIdx}
        alarms={alarms}
        onClose={() => setSettingsOpen(false)}
        onColorChange={applyColor}
        onAlarmTime={setAlarmTime}
        onAlarmToggle={toggleAlarm}
        showGoogleSignIn={status !== 'authenticated'}
      />
    </main>
  );
}
