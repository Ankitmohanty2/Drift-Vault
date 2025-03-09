module.exports = {
	content: [
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	darkMode: 'class',
	theme: {
		extend: {
			colors: {
				// Light mode colors
				primary: {
					DEFAULT: '#2563eb',
					focus: '#1d4ed8',
				},
				secondary: {
					DEFAULT: '#0ea5e9',
					focus: '#0284c7',
				},
				accent: {
					DEFAULT: '#0284c7',
					focus: '#0369a1',
				},
			},
		},
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: [
			{
				light: {
					"primary": "#2563eb",
					"secondary": "#0ea5e9",
					"accent": "#0284c7",
					"neutral": "#2a323c",
					"base-100": "#ffffff",
					"base-200": "#f9fafb",
					"base-300": "#f3f4f6",
					"base-content": "#1f2937",
				},
				dark: {
					"primary": "#3b82f6",
					"secondary": "#38bdf8",
					"accent": "#0ea5e9",
					"neutral": "#1f2937",
					"base-100": "#1f2937",
					"base-200": "#111827",
					"base-300": "#0f172a",
					"base-content": "#f9fafb",
				},
			},
		],
	},
};
