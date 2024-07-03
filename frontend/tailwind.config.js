module.exports = {
  content: [
		'./src/components/**/*.{vue,js,ts,jsx,tsx}',
		'./src/pages/**/*.{vue,js,ts,jsx,tsx}',
		'./src/App.vue'
	],
	variants: {
		extend: {
			textColor: ['hover'],
		}
	},
	theme: {
		extend: {
			fontFamily: {
				'sans': ['Kode Mono', 'sans-serif'],
				'sus': ['Barriecito', 'sans-serif']
			},
			colors: {
        'anarcapYellow': '#fdfd00',
      },
		},
	},
	plugins: []
}