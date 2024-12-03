/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				roboto: ["Roboto"],
			},
			scale: {
				102: "1.02",
			},
			colors: {
				mine: "#16113a",
			},
		},
	},
	plugins: [],
};
