// The site used to register a next-pwa service worker at this url. Browsers that still have it
// fetch this file on their next visit, so it clears the old caches, unregisters, and reloads open tabs.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
	event.waitUntil((async () => {
		const keys = await caches.keys();
		await Promise.all(keys.map((key) => caches.delete(key)));
		await self.registration.unregister();
		const clients = await self.clients.matchAll({type: 'window'});
		clients.forEach((client) => client.navigate(client.url));
	})());
});
