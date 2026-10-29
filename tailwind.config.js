const {join} = require('path');

module.exports = {
	content: [
		join(__dirname, 'pages', '**', '*.{js,jsx,ts,tsx}'),
		join(__dirname, 'components', '**', '*.{js,jsx,ts,tsx}'),
		join(__dirname, 'contexts', '**', '*.{js,jsx,ts,tsx}'),
		join(__dirname, 'utils', '**', '*.{js,jsx,ts,tsx}')
	],
	theme: {
		extend: {
			colors: {
				'beige': '#EAE8E1',
				'yblue': '#6176b4',
				'yearn-blue': 'hsl(220, 95%, 50%)'
			},
			borderColor: {
				DEFAULT: 'currentColor'
			},
			width: {
				68: '17rem',
				'250%': '250%'
			},
			minWidth: {
				68: '17rem',
				80: '20rem'
			},
			fontFamily: {
				scope: ['Scope', 'Roboto', 'serif'],
				monument: ['Monument', 'sans-serif'],
				peste: ['Peste', 'sans-serif'],
				chicago: ['Chicago', 'mono'],
				bluepill: ['New Spirit Bold Condensed', 'sans-serif']
			},
			maxWidth: {
				xl: '552px'
			},
			fontSize: {
				'base': ['16px', '24px'],
				'lg': ['1.125rem', '1.75rem'],
				'xl': ['24px', '32px'],
				'3xl': ['32px', '40px'],
				'4xl': ['2.25rem', '2.5rem']
			},
			animation: {
				marquee: 'marquee 25s linear infinite',
				marquee2: 'marquee2 25s linear infinite'
			},
			keyframes: {
				marquee: {
					'0%': {transform: 'translateX(0%)'},
					'100%': {transform: 'translateX(-100%)'}
				},
				marquee2: {
					'0%': {transform: 'translateX(100%)'},
					'100%': {transform: 'translateX(0%)'}
				}
			}
		}
	},
	plugins: []
};
