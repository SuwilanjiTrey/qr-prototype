/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Add all the specific colors you're using in your gradients
        cyan: {
          400: '#22d3ee',
          500: '#06b6d4',
        },
        purple: {
          400: '#a78bfa',
          500: '#8b5cf6',
        },
        pink: {
          400: '#f472b6',
          500: '#ec4899',
        },
        indigo: {
          500: '#6366f1',
          900: '#312e81',
        },
        rose: {
          500: '#f43f5e',
        },
        emerald: {
          500: '#10b981',
        },
        green: {
          400: '#4ade80',
          500: '#22c55e',
        },
        slate: {
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      // Add backgroundImage for gradients if needed
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // For text gradients
    // Other plugins you might need
  ],
}
