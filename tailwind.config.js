import scrollbar from 'tailwind-scrollbar'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        tealish: '#13A09D', // Add your brand color
      },
    },
  },
  plugins: [scrollbar],
}
