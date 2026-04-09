# World Clock

Retro-styled dual world clock built with Next.js, React, TypeScript, and Zustand.

## What it does

The app shows two large timezone panels side by side and lets you configure each one independently.

- Each clock panel has its own IATA airport code and timezone.
- Each clock panel has its own `12h` / `24h` setting.
- Display color is global for the whole device-style frame.
- Two alarms can be configured in local device time.
- Settings are persisted locally in the browser.

## Current features

### Clock panels

- Two side-by-side timezone displays.
- Live time and date formatting per selected timezone.
- Right-click on desktop or long-press on mobile to open per-clock settings.
- Per-clock settings include:
  - changing the airport by IATA code
  - switching that specific clock between `12h` and `24h`
- Layout adapts when one clock is `12h` and the other is `24h`, so heights stay visually aligned.

### Airport lookup

- Airport data is fetched from [mwgg/Airports](https://github.com/mwgg/Airports).
- If the remote database is unavailable, the app falls back to a built-in offline airport list.
- The UI shows a small database status badge.

### Global settings

- Clicking the `World Time` title opens the global settings modal.
- Global settings currently include:
  - display color theme
  - two alarms

### Alarms

- Two alarms are available.
- Alarm time is edited in device local time.
- Internally the alarm is stored in UTC minutes.
- When an alarm triggers, the app plays two short beeps.

### Persistence

- User configuration is persisted locally with Zustand `persist`.
- Persisted data includes:
  - both clock panels
  - per-clock `12h` / `24h` format
  - global color selection
  - alarms

## Stack

- Next.js 16
- React 19
- TypeScript
- Zustand
- Plain CSS
- ESLint + Prettier
- GitHub Actions CI for lint and format checks

## Local development

### Requirements

- Node `v24.14`
- pnpm `10.33.0`

The repo already includes [`.nvmrc`](/C:/Users/j9898/projects/world-clock/.nvmrc) with the expected Node version.

### Install and run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm lint:fix
pnpm format
pnpm format:check
```

## Project structure

```text
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    ClockPanel.tsx
    IATAModal.tsx
    SettingsModal.tsx
  hooks/
    useAirportDB.ts
    useAlarms.ts
    useClock.ts
    useScale.ts
  lib/
    airports.ts
    colors.ts
  stores/
    useWorldClockStore.ts
```

## Notes

- Fonts use local/system fallbacks, so the build does not depend on Google Fonts.
- The app is intentionally client-side for interactive state, but avoids hydration issues by hydrating persisted Zustand state after mount.
