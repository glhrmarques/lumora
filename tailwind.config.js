/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: 'rgb(var(--color-warm-ivory) / <alpha-value>)',
        burgundy: 'rgb(var(--color-deep-burgundy) / <alpha-value>)',
        teal: 'rgb(var(--color-forest-teal) / <alpha-value>)',
        sienna: 'rgb(var(--color-burnt-sienna) / <alpha-value>)',
        charcoal: 'rgb(var(--color-soft-charcoal) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        accent: 'rgb(var(--color-accent) / <alpha-value>)',
        highlight: 'rgb(var(--color-highlight) / <alpha-value>)',
        'highlight-on-dark': 'rgb(var(--color-highlight-on-dark) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        'on-primary': 'rgb(var(--color-on-primary) / <alpha-value>)',
      },
      fontFamily: {
        display: 'var(--font-display)',
        body: 'var(--font-body)',
      },
      fontSize: {
        button: 'var(--button-font-size)',
      },
      lineHeight: {
        display: 'var(--leading-display)',
        body: 'var(--leading-body)',
      },
      spacing: {
        button: 'var(--button-padding-inline)',
      },
      height: {
        button: 'var(--button-height)',
      },
      borderRadius: {
        button: 'var(--button-radius)',
      },
      borderWidth: {
        button: 'var(--button-border-width)',
      },
    },
  },
  plugins: [],
}
