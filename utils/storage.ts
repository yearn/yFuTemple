// storage can be unavailable (blocked site data, some private modes), and the site works without it
export function readStorage(key: string): string | null {
	try {
		return window.localStorage.getItem(key);
	} catch {
		return null;
	}
}

export function writeStorage(key: string, value: string): void {
	try {
		window.localStorage.setItem(key, value);
	} catch {
		// nothing to remember then
	}
}
