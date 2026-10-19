/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/access.{js,jsx,ts,tsx}',
    './src/app.{js,jsx,ts,tsx}',
    './src/global.{css,less,scss}',

    './src/api/**/*.{js,jsx,ts,tsx}',
    './src/authoring/**/*.{js,jsx,ts,tsx}',
    './src/components/**/*.{js,jsx,ts,tsx}',
    './src/constants/**/*.{js,jsx,ts,tsx}',
    './src/hooks/**/*.{js,jsx,ts,tsx}',
    './src/locales/**/*.{js,jsx,ts,tsx}',
    './src/models/**/*.{js,jsx,ts,tsx}',
    './src/pages/**/*.{js,jsx,ts,tsx}',
    './src/utils/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
};
