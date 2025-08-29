/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				brand: {
					DEFAULT: "#111827",
					accent: "#8b5cf6",
				}
			}
		}
	},
	plugins: [],
};


