module.exports = {
	output: 'export',
	trailingSlash: true,
	images: {
		// assets are committed pre-encoded at the sizes they're shown at
		unoptimized: true
	},
	env: {
		WEBSITE_URI: process.env.WEBSITE_URI
	}
};
