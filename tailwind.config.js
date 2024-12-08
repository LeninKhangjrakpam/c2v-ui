const colors = ["green", "yellow", "rose", "blue"];

/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	safelist: [
		...colors.map((color) => `bg-${color}-50`),
		...colors.map((color) => `border-l-${color}-500`),
		...colors.map((color) => `text-${color}-600`),
		...colors.map((color) => `bg-${color}-500`),
	],
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
