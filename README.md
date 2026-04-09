# World Clock

Dual-timezone wall clock built with Next.js 14 + TypeScript.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
src/
├── app/
│   ├── layout.tsx       # Root layout, loads Share Tech Mono font
│   ├── page.tsx         # Main page — assembles all components
│   └── globals.css      # All styles (CSS variables for theming)
├── components/
│   ├── ClockPanel.tsx   # Single timezone display
│   ├── IATAModal.tsx    # Right-click modal for changing IATA code
│   └── SettingsModal.tsx# Settings: colour, 12/24h, alarms
├── hooks/
│   ├── useAirportDB.ts  # Fetches mwgg/Airports JSON, falls back offline
│   ├── useClock.ts      # 1s tick, formats time + date per timezone
│   ├── useAlarms.ts     # Two alarms, stored in UTC, displayed local
│   └── useScale.ts      # CSS transform scale to fill viewport
└── lib/
    ├── airports.ts      # Airport types, fetch logic, IATA lookup
    └── colors.ts        # Six colour theme definitions
```

## Features

- **Two timezone panels** — right-click or long-press to change IATA code
- **Live airport database** — ~9k airports from [mwgg/Airports](https://github.com/mwgg/Airports), falls back to 15 built-in entries offline
- **Settings** (click "World Time" title):
  - Display colour (amber / green / cyan / white / red / purple)
  - Time format (12h / 24h)
  - Two alarms — set in local device time, stored internally as UTC, two soft beeps on trigger
- **Fullscreen scaling** — scales to fill any window size while preserving proportions
