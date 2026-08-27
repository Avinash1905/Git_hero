/**
 * GitHero Authoritative Design System Tokens
 * Strictly adhering to Google Stitch visual identity and dark-mode cyber aesthetic.
 */

export const TOKENS = {
  colors: {
    // Surface & Background Colors
    surface: '#081425',
    surfaceDim: '#081425',
    surfaceBright: '#2f3a4c',
    surfaceContainerLowest: '#040e1f',
    surfaceContainerLow: '#111c2d',
    surfaceContainer: '#152031',
    surfaceContainerHigh: '#1f2a3c',
    surfaceContainerHighest: '#2a3548',
    background: '#081425',

    // Content & Typography Colors
    onSurface: '#d8e3fb',
    onSurfaceVariant: '#bbcabf',
    onBackground: '#d8e3fb',
    inverseSurface: '#d8e3fb',
    inverseOnSurface: '#263143',

    // Primary Accents (Mint / Git Green)
    primary: '#4edea3',
    onPrimary: '#003824',
    primaryContainer: '#10b981',
    onPrimaryContainer: '#00422b',
    primaryFixed: '#6ffbbe',
    primaryFixedDim: '#4edea3',
    onPrimaryFixed: '#002113',

    // Secondary Accents (Cobalt / Cyan Blue)
    secondary: '#adc6ff',
    onSecondary: '#002e6a',
    secondaryContainer: '#0566d9',
    onSecondaryContainer: '#e6ecff',
    secondaryFixed: '#d8e2ff',
    secondaryFixedDim: '#adc6ff',

    // Tertiary Accents (Amber / Warning / Alert)
    tertiary: '#ffb95f',
    onTertiary: '#472a00',
    tertiaryContainer: '#e29100',
    onTertiaryContainer: '#523200',
    tertiaryFixed: '#ffddb8',
    tertiaryFixedDim: '#ffb95f',

    // Error & Critical Accents (Rose / Coral Red)
    error: '#ffb4ab',
    onError: '#690005',
    errorContainer: '#93000a',
    onErrorContainer: '#ffdad6',

    // Outlines & Borders
    outline: '#86948a',
    outlineVariant: '#3c4a42',
    surfaceTint: '#4edea3'
  },

  typography: {
    fontFamily: {
      display: '"Geist", system-ui, -apple-system, sans-serif',
      body: '"Geist", system-ui, -apple-system, sans-serif',
      code: '"JetBrains Mono", "Courier New", monospace',
      terminal: '"JetBrains Mono", "Courier New", monospace'
    },
    fontSize: {
      displayLg: '48px',
      headlineMd: '32px',
      headlineSm: '24px',
      bodyMd: '16px',
      bodySm: '14px',
      terminalCode: '16px',
      terminalLabel: '12px',
      hudStat: '18px',
      micro: '10px'
    },
    lineHeight: {
      tight: 1.1,
      heading: 1.2,
      body: 1.6,
      code: 1.5
    },
    letterSpacing: {
      tight: '-0.04em',
      normal: '0',
      label: '0.08em',
      wide: '0.15em'
    }
  },

  spacing: {
    unit: '4px',
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '48px',
    hudMargin: '32px',
    gridGutter: '2px'
  },

  borderRadius: {
    xs: '0.125rem',
    sm: '0.25rem',
    DEFAULT: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px'
  },

  shadows: {
    glowPrimary: '0 0 20px rgba(78, 222, 163, 0.4)',
    glowSecondary: '0 0 20px rgba(173, 198, 255, 0.4)',
    glowAmber: '0 0 20px rgba(226, 145, 0, 0.4)',
    glowError: '0 0 20px rgba(255, 180, 171, 0.4)',
    cardShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
    modalShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
  },

  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '400ms cubic-bezier(0.4, 0, 0.2, 1)'
  },

  zIndex: {
    background: 0,
    gameGrid: 10,
    hud: 30,
    topBar: 50,
    bottomNav: 50,
    toast: 70,
    modal: 90,
    tooltip: 100
  }
};
