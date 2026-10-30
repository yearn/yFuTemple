module.exports = {
	output: 'export',
	trailingSlash: true,
	experimental: {
		// put the page back where it was on back and forward, the home page is long
		scrollRestoration: true
	},
	images: {
		// assets are committed pre-encoded at the sizes they're shown at
		unoptimized: true
	},
	env: {
		WEBSITE_URI: process.env.WEBSITE_URI ?? 'https://temple.yearn.fi/'
	}
};
