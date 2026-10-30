import React, {createContext, use, useCallback, useEffect, useMemo, useRef, useState} from 'react';

import type {ReactElement, ReactNode} from 'react';

export type TTrack = {
	slug: string,
	title: string,
	mark: string
};

export type TAudioProgress = {
	currentTime: number,
	duration: number
};

type TAudioContext = {
	tracks: TTrack[],
	current: number,
	isPlaying: boolean,
	progress: TAudioProgress,
	volume: number,
	error: string | null,
	play: (index?: number) => void,
	pause: () => void,
	toggle: () => void,
	next: () => void,
	previous: () => void,
	seek: (time: number) => void,
	set_volume: (volume: number) => void
};

const TRACKS: TTrack[] = [
	// the goddesses in the order the site presents them, then the tree
	{slug: 'techne', title: 'TECHNE', mark: '/audio-marks/techne.avif'},
	{slug: 'transmission', title: 'TRANSMISSION', mark: '/audio-marks/transmission.avif'},
	{slug: 'community', title: 'COMMUNITY', mark: '/audio-marks/community.avif'},
	{slug: 'dominion', title: 'DOMINION', mark: '/audio-marks/dominion.avif'},
	{slug: 'yearning_tree', title: 'YEARNING TREE', mark: '/audio-marks/yfiTree.avif'}
];

// past this many seconds "previous" restarts the track instead of going back one
const RESTART_AFTER = 3;

const Audio = createContext<TAudioContext>({
	tracks: TRACKS,
	current: 0,
	isPlaying: false,
	progress: {currentTime: 0, duration: 0},
	volume: 1,
	error: null,
	play: (): void => undefined,
	pause: (): void => undefined,
	toggle: (): void => undefined,
	next: (): void => undefined,
	previous: (): void => undefined,
	seek: (): void => undefined,
	set_volume: (): void => undefined
});

// opus where the browser has it, the aac encode of the same master elsewhere (older safari)
function sourceFor(element: HTMLAudioElement, track: TTrack): string {
	return element.canPlayType('audio/ogg; codecs=opus') ? `/audio/${track.slug}.opus` : `/audio/${track.slug}.m4a`;
}

function readProgress(element: HTMLAudioElement): TAudioProgress {
	// duration is NaN before metadata and Infinity when the server can't serve byte ranges
	return {currentTime: element.currentTime, duration: Number.isFinite(element.duration) ? element.duration : 0};
}

export function formatRemaining({currentTime, duration}: TAudioProgress): string {
	const remaining = Math.max(duration - currentTime, 0);
	const minutes = Math.floor(remaining / 60);
	const seconds = String(Math.floor(remaining % 60)).padStart(2, '0');
	return `${minutes}:${seconds}`;
}

// one audio element for the whole site, mounted once so navigation never interrupts it.
// every bit of state follows the element's own events, so the ui can't drift from what is playing.
export function AudioContextApp({children}: {children: ReactNode}): ReactElement {
	const audio = useRef<HTMLAudioElement>(null);
	const shouldPlayNext = useRef(false);
	const [current, set_current] = useState(0);
	const [isPlaying, set_isPlaying] = useState(false);
	const [progress, set_progress] = useState<TAudioProgress>({currentTime: 0, duration: 0});
	const [volume, set_volumeState] = useState(1);
	const [error, set_error] = useState<string | null>(null);

	const start = useCallback((element: HTMLAudioElement): void => {
		set_error(null);
		element.play().catch((reason: Error): void => {
			// a newer load interrupting this play is expected, anything else means it never started
			if (reason.name !== 'AbortError') {
				set_error('Playback failed. Press play to try again.');
			}
		});
	}, []);

	useEffect((): void => {
		const element = audio.current;
		if (!element) {
			return;
		}
		element.src = sourceFor(element, TRACKS[current]);
		set_progress({currentTime: 0, duration: 0});
		if (shouldPlayNext.current) {
			shouldPlayNext.current = false;
			start(element);
		}
	}, [current, start]);

	const play = useCallback((index?: number): void => {
		if (index === undefined || index === current) {
			if (audio.current) {
				start(audio.current);
			}
			return;
		}
		shouldPlayNext.current = true;
		set_current(index);
	}, [current, start]);

	const pause = useCallback((): void => audio.current?.pause(), []);

	const toggle = useCallback((): void => (isPlaying ? pause() : play()), [isPlaying, pause, play]);

	// switching tracks keeps playing if we were, and stays paused if we weren't
	const next = useCallback((): void => {
		shouldPlayNext.current = isPlaying;
		set_current((index): number => (index + 1) % TRACKS.length);
	}, [isPlaying]);

	const previous = useCallback((): void => {
		if (audio.current && audio.current.currentTime > RESTART_AFTER) {
			audio.current.currentTime = 0;
			return;
		}
		shouldPlayNext.current = isPlaying;
		set_current((index): number => (index - 1 + TRACKS.length) % TRACKS.length);
	}, [isPlaying]);

	const seek = useCallback((time: number): void => {
		if (audio.current) {
			audio.current.currentTime = time;
		}
	}, []);

	const set_volume = useCallback((value: number): void => {
		if (audio.current) {
			audio.current.volume = value;
		}
	}, []);

	// system and headset controls where the browser offers them
	useEffect((): void => {
		if ('mediaSession' in navigator) {
			const track = TRACKS[current];
			navigator.mediaSession.metadata = new MediaMetadata({title: track.title, artist: 'yFu Temple', artwork: [{src: track.mark, type: 'image/avif'}]});
		}
	}, [current]);

	useEffect((): (() => void) | void => {
		if (!('mediaSession' in navigator)) {
			return;
		}
		const handlers: [MediaSessionAction, MediaSessionActionHandler][] = [
			['play', (): void => play()],
			['pause', pause],
			['previoustrack', previous],
			['nexttrack', next],
			['seekto', (details): void => seek(details.seekTime ?? 0)]
		];
		const bindHandlers = (isClearing: boolean): void => handlers.forEach(([action, handler]): void => {
			try {
				navigator.mediaSession.setActionHandler(action, isClearing ? null : handler);
			} catch {
				// this browser doesn't support that action
			}
		});
		bindHandlers(false);
		return (): void => bindHandlers(true);
	}, [next, pause, play, previous, seek]);

	const value = useMemo((): TAudioContext => ({
		tracks: TRACKS, current, isPlaying, progress, volume, error, play, pause, toggle, next, previous, seek, set_volume
	}), [current, error, isPlaying, next, pause, play, previous, progress, seek, set_volume, toggle, volume]);

	return (
		<Audio.Provider value={value}>
			{children}
			<audio
				ref={audio}
				preload={'metadata'}
				onPlay={(): void => set_isPlaying(true)}
				onPause={(): void => set_isPlaying(false)}
				onEnded={(): void => {
					shouldPlayNext.current = true;
					set_current((index): number => (index + 1) % TRACKS.length);
				}}
				onTimeUpdate={(event): void => set_progress(readProgress(event.currentTarget))}
				onDurationChange={(event): void => set_progress(readProgress(event.currentTarget))}
				onVolumeChange={(event): void => set_volumeState(event.currentTarget.volume)}
				onError={(): void => set_error('This track could not be loaded.')} />
		</Audio.Provider>
	);
}

export const useAudio = (): TAudioContext => use(Audio);
export default useAudio;
