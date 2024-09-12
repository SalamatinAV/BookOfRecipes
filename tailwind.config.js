/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      backgroundColor: {
        "custom-green": "rgb(0 139 12 / 44%)",
        black: "rgba(0, 0, 0, 0.43)",
      },
    },
  },
  plugins: [],
};
