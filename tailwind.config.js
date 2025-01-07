/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#00b36b",
        secondary: "#f5f5f5",
        dark: "#333333",
      },
      backgroundImage: {
        'hero-background': "url('/hero/hero-background.png')",
        'steps-background': "url('/steps/step-background.png')",
        'contact-background': "url('/contact.png')",
      }
    },
  },
  plugins: [],
};