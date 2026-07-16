/** Brand palette. Prefer semantic tokens in application code. */
export const palette = {
  warmIvory: '#FFF8EE',
  deepBurgundy: '#6B2737',
  forestTeal: '#2D6A5E',
  burntSienna: '#C4623A',
  softCharcoal: '#3D3D3D',
} as const

export const colorTokens = {
  background: palette.warmIvory,
  foreground: palette.softCharcoal,
  primary: palette.deepBurgundy,
  secondary: palette.forestTeal,
  accent: palette.burntSienna,
} as const

export type PaletteColor = keyof typeof palette
export type ColorToken = keyof typeof colorTokens
