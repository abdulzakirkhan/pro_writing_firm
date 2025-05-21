import scrollbar from 'tailwind-scrollbar'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tealish: '#6da5f9', // Add your brand color
      },
    },
  },
  plugins: [scrollbar],
}
