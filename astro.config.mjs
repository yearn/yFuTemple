import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import {defineConfig} from 'astro/config';

export default defineConfig({
	site: process.env.WEBSITE_URI ?? 'https://temple.yearn.fi/',
	trailingSlash: 'always',
	integrations: [react()],
	vite: {plugins: [tailwindcss()]}
});
