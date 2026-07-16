export const fontFamilies = {
  /** Editorial serif used for titles and headers. */
  display: 'Georgia, Cambria, "Times New Roman", Times, serif',
  /** Nunito is the brand face for body copy and sub-headers. */
  sans: 'Nunito, ui-sans-serif, system-ui, sans-serif',
} as const

export const fontWeights = {
  regular: 400,
  semibold: 600,
  bold: 700,
} as const

export const typographyTokens = {
  title: {
    fontFamily: fontFamilies.display,
    fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
    fontWeight: fontWeights.bold,
    lineHeight: 0.95,
    letterSpacing: '-0.035em',
  },
  heading: {
    fontFamily: fontFamilies.display,
    fontSize: '2rem',
    fontWeight: fontWeights.bold,
    lineHeight: 1.1,
    letterSpacing: '-0.02em',
  },
  subheading: {
    fontFamily: fontFamilies.sans,
    fontSize: '1.25rem',
    fontWeight: fontWeights.bold,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
  },
  body: {
    fontFamily: fontFamilies.sans,
    fontSize: '1rem',
    fontWeight: fontWeights.regular,
    lineHeight: 1.5,
    letterSpacing: '0',
  },
} as const

export type TypographyToken = keyof typeof typographyTokens
