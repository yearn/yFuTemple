import {useCallback, useLayoutEffect, useRef} from 'preact/hooks';

// a stable function that always calls the latest callback, for listeners that outlive renders
export function useEffectEvent<TArgs extends unknown[]>(callback: (...args: TArgs) => void): (...args: TArgs) => void {
	const latest = useRef(callback);
	useLayoutEffect((): void => {
		latest.current = callback;
	});
	return useCallback((...args: TArgs): void => latest.current(...args), []);
}
