export interface ColorTheme {
  name: string;
  main: string;
  sub: string;
  glow1: string;
  glow2: string;
  subglow: string;
  ghost: string;
}

export const COLORS: ColorTheme[] = [
  {
    name: 'amber',
    main: '#ff6b00',
    sub: '#ff9a3c',
    glow1: 'rgba(255,107,0,0.6)',
    glow2: 'rgba(255,107,0,0.3)',
    subglow: 'rgba(255,154,60,0.5)',
    ghost: 'rgba(255,107,0,0.08)',
  },
  {
    name: 'green',
    main: '#39ff14',
    sub: '#7fff00',
    glow1: 'rgba(57,255,20,0.55)',
    glow2: 'rgba(57,255,20,0.25)',
    subglow: 'rgba(127,255,0,0.4)',
    ghost: 'rgba(57,255,20,0.07)',
  },
  {
    name: 'cyan',
    main: '#00e5ff',
    sub: '#80f0ff',
    glow1: 'rgba(0,229,255,0.55)',
    glow2: 'rgba(0,229,255,0.25)',
    subglow: 'rgba(128,240,255,0.4)',
    ghost: 'rgba(0,229,255,0.07)',
  },
  {
    name: 'white',
    main: '#e8e8e8',
    sub: '#aaaaaa',
    glow1: 'rgba(232,232,232,0.4)',
    glow2: 'rgba(232,232,232,0.2)',
    subglow: 'rgba(170,170,170,0.3)',
    ghost: 'rgba(232,232,232,0.06)',
  },
  {
    name: 'red',
    main: '#ff2d2d',
    sub: '#ff6060',
    glow1: 'rgba(255,45,45,0.55)',
    glow2: 'rgba(255,45,45,0.25)',
    subglow: 'rgba(255,96,96,0.4)',
    ghost: 'rgba(255,45,45,0.07)',
  },
  {
    name: 'purple',
    main: '#bf5fff',
    sub: '#d98aff',
    glow1: 'rgba(191,95,255,0.55)',
    glow2: 'rgba(191,95,255,0.25)',
    subglow: 'rgba(217,138,255,0.4)',
    ghost: 'rgba(191,95,255,0.07)',
  },
];
