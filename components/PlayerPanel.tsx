import React, {useEffect} from 'react';

import {formatRemaining, useAudio} from '../contexts/useAudio';
import IconPause from './icons/IconPause';
import IconPlay from './icons/IconPlay';
import IconPrev from './icons/IconPrev';

import type {ReactElement} from 'react';

type TPlayerPanel = {
	isOpen: boolean,
	onClose: () => void
};

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';
const ICON_BUTTON = `flex size-8 items-center justify-center hover:bg-white hover:text-black ${FOCUS}`;

// a bottom sheet on phones, a panel under the header on larger screens
export default function PlayerPanel({isOpen, onClose}: TPlayerPanel): ReactElement | null {
	const {tracks, current, isPlaying, progress, volume, error, play, toggle, next, previous, seek, set_volume} = useAudio();

	useEffect((): (() => void) | void => {
		if (!isOpen) {
			return;
		}
		const onKeyDown = (event: KeyboardEvent): void => {
			if (event.key === 'Escape') {
				onClose();
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return (): void => window.removeEventListener('keydown', onKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) {
		return null;
	}

	const track = tracks[current];
	return (
		<section
			aria-label={'Media player'}
			className={'fixed inset-x-0 bottom-0 z-30 max-h-[80dvh] overflow-y-auto border-t-2 border-white bg-black font-scope text-white md:inset-x-auto md:bottom-auto md:right-4 md:top-20 md:w-96 md:border-2'}>
			<div className={'flex h-8 items-center justify-between border-b-2 border-white pl-3 text-lg'}>
				<h2>{'YFU MEDIA PLAYER'}</h2>
				<button
					type={'button'}
					onClick={onClose}
					aria-label={'Close media player'}
					className={ICON_BUTTON}>
					{'X'}
				</button>
			</div>
			<img
				src={track.mark}
				alt={''}
				className={'hidden h-56 w-full object-contain p-6 sm:block'} />
			<div className={'space-y-2 border-y-2 border-white p-3'}>
				<div className={'flex items-center gap-1'}>
					<button
						type={'button'}
						onClick={previous}
						aria-label={'Previous track'}
						className={ICON_BUTTON}>
						<IconPrev />
					</button>
					<button
						type={'button'}
						onClick={toggle}
						aria-label={isPlaying ? 'Pause' : 'Play'}
						className={ICON_BUTTON}>
						{isPlaying ? <IconPause /> : <IconPlay />}
					</button>
					<button
						type={'button'}
						onClick={next}
						aria-label={'Next track'}
						className={ICON_BUTTON}>
						<IconPrev className={'rotate-180'} />
					</button>
					<span className={'ml-2 truncate'}>{track.title}</span>
					<span className={'ml-auto tabular-nums'}>{formatRemaining(progress)}</span>
				</div>
				<input
					type={'range'}
					min={0}
					max={progress.duration}
					step={0.1}
					value={progress.currentTime}
					disabled={!progress.duration}
					onChange={(event): void => seek(Number(event.target.value))}
					aria-label={'Seek'}
					className={`w-full accent-white ${FOCUS}`} />
				<label className={'flex items-center gap-3 text-sm'}>
					<span>{'VOL'}</span>
					<input
						type={'range'}
						min={0}
						max={1}
						step={0.05}
						value={volume}
						onChange={(event): void => set_volume(Number(event.target.value))}
						className={`w-full accent-white ${FOCUS}`} />
				</label>
				{error ? <p role={'alert'} className={'text-sm text-yblue'}>{error}</p> : null}
			</div>
			<ol>
				{tracks.map((item, index): ReactElement => (
					<li key={item.slug} className={'border-b-2 border-white last:border-b-0'}>
						<button
							type={'button'}
							aria-current={index === current ? 'true' : undefined}
							onClick={(): void => (index === current ? toggle() : play(index))}
							className={`flex w-full items-center gap-3 px-3 py-1.5 text-left hover:bg-white hover:text-black aria-[current=true]:bg-white/20 ${FOCUS}`}>
							{index === current && isPlaying ? <IconPause /> : <IconPlay />}
							<span>{item.title}</span>
						</button>
					</li>
				))}
			</ol>
		</section>
	);
}
