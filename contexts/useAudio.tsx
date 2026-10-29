import React, {createContext, useContext, useEffect, useState} from 'react';

import type {ReactElement} from 'react';

const AUDIO_LIST: [string, string, string][] = [
	['TECHNE', '/audio/techne.opus', '/audio-marks/techne.avif'],
	['YEARNING TREE', '/audio/yearning_tree.opus', '/audio-marks/yfiTree.avif'],
	['DOMINION', '/audio/dominion.opus', '/audio-marks/dominion.avif'],
	['COMMUNITY', '/audio/community.opus', '/audio-marks/community.avif'],
	['TRANSMISSION', '/audio/transmission.opus', '/audio-marks/transmission.avif']
];

type TAudioContext = {
	audio: HTMLAudioElement | null,
	set_audio: React.Dispatch<React.SetStateAction<HTMLAudioElement | null>>,
	isPlaying: boolean,
	set_isPlaying: React.Dispatch<React.SetStateAction<boolean>>,
	AUDIO_LIST: [string, string, string][];
};

export type TAudioProgress = {
	currentTime: number,
	duration: number
};

const Audio = createContext<TAudioContext>({
	audio: null,
	set_audio: (): void => undefined,
	isPlaying: false,
	set_isPlaying: (): void => undefined,
	AUDIO_LIST
});

export const AudioContextApp = ({children=<div />}): ReactElement => {
	const [audio, set_audio] = useState<HTMLAudioElement | null>(null);
	const [isPlaying, set_isPlaying] = useState<boolean>(false);

	return (
		<Audio.Provider
			value={{
				audio,
				set_audio,
				isPlaying,
				set_isPlaying,
				AUDIO_LIST
			}}>
			{children}

		</Audio.Provider>
	);
};

export function useAudioProgress(audio: HTMLAudioElement | null): TAudioProgress {
	const [progress, set_progress] = useState<TAudioProgress>({currentTime: 0, duration: 0});

	useEffect((): (() => void) | void => {
		if (!audio) {
			return;
		}
		const events = ['timeupdate', 'durationchange', 'emptied'];
		// duration is NaN before metadata and Infinity when the server can't serve byte ranges
		const update = (): void => set_progress({currentTime: audio.currentTime, duration: Number.isFinite(audio.duration) ? audio.duration : 0});
		update();
		events.forEach((event): void => audio.addEventListener(event, update));
		return (): void => events.forEach((event): void => audio.removeEventListener(event, update));
	}, [audio]);

	return progress;
}

export function formatRemaining({currentTime, duration}: TAudioProgress): string {
	const remaining = Math.max(duration - currentTime, 0);
	const minutes = Math.floor(remaining / 60);
	const seconds = String(Math.floor(remaining % 60)).padStart(2, '0');
	return `${minutes}:${seconds}`;
}

export const useAudio = (): TAudioContext => useContext(Audio);
export default useAudio;
