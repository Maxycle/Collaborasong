module.exports = {
  content: [
		'./src/components/**/*.{vue,js,ts,jsx,tsx}',
		'./src/pages/**/*.{vue,js,ts,jsx,tsx}',
		'./src/App.vue'
	],
	theme: {
		extend: {
			fontFamily: {
				'sans': ['Kode Mono', 'sans-serif'],
				'sus': ['Barriecito', 'sans-serif']
			},
			// backgroundImage:{
      //   'anarcap': 'url(/home/maxycle/code/Collaborasound/app/assets/images/Flag_of_Anarcho-capitalism.png)',
			// 	'croco': 'url(/home/maxycle/code/Collaborasound/app/assets/images/croco.jpg)'
      // },
			colors: {
        'anarcapYellow': '#fdfd00',
      },
		},
	},
	plugins: []
}

