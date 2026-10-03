/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,hbs}', // Adjust to match your project structure
    './views/**/*.hbs',         // Include all .hbs files in your views directory
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  purge: {
    content: ["./src/**/*.{html,js,hbs}"],
    safelist: ["text-red-500"],
},
};