import React, {useEffect, useRef, useState} from 'react';

import {formatRemaining, useAudio} from '../contexts/useAudio';
import IconPause from './icons/IconPause';
import IconPlay from './icons/IconPlay';
import IconPrev from './icons/IconPrev';

import type {PointerEvent as ReactPointerEvent, ReactElement} from 'react';

type TPlayerPanel = {
	isOpen: boolean,
	onClose: () => void
};

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';
const ICON_BUTTON = `flex size-8 items-center justify-center hover:bg-white hover:text-black ${FOCUS}`;

function clamp(value: number, min: number, max: number): number {
	return Math.min(Math.max(value, min), max);
}

// a bottom sheet on phones, a panel under the header's player on larger screens, dragged by its title bar
export default function PlayerPanel({isOpen, onClose}: TPlayerPanel): ReactElement | null {
	const {tracks, current, isPlaying, progress, volume, error, play, toggle, next, previous, seek, set_volume} = useAudio();
	const panel = useRef<HTMLElement>(null);
	const [offset, set_offset] = useState({x: 0, y: 0});

	// a new viewport size can leave a dragged panel off screen, so it goes home
	useEffect((): (() => void) => {
		const onResize = (): void => set_offset({x: 0, y: 0});
		window.addEventListener('resize', onResize);
		return (): void => window.removeEventListener('resize', onResize);
	}, []);

	const onDragStart = (event: ReactPointerEvent<HTMLDivElement>): void => {
		if (event.button !== 0 || (event.target as Element).closest('button') || !panel.current) {
			return;
		}
		const handle = event.currentTarget;
		const rect = panel.current.getBoundingClientRect();
		const {clientWidth, clientHeight} = document.documentElement;
		// the phone bottom sheet spans the screen and stays put
		if (rect.width >= clientWidth) {
			return;
		}
		// where the panel sits without the offset, so it can be kept on screen with the title bar reachable
		const home = {left: rect.left - offset.x, right: rect.right - offset.x, top: rect.top - offset.y};
		const start = {x: event.clientX - offset.x, y: event.clientY - offset.y};
		const onMove = (move: PointerEvent): void => set_offset({
			x: clamp(move.clientX - start.x, -home.left, clientWidth - home.right),
			y: clamp(move.clientY - start.y, -home.top, clientHeight - home.top - handle.offsetHeight)
		});
		handle.setPointerCapture(event.pointerId);
		handle.addEventListener('pointermove', onMove);
		handle.addEventListener('lostpointercapture', (): void => handle.removeEventListener('pointermove', onMove), {once: true});
	};

	useEffect((): (() => void) | void => {
		if (!isOpen) {
			return;
		}
		const onKeyDown = (event: KeyboardEvent): void => {
			// an open image viewer takes escape for itself
			if (event.key === 'Escape' && !event.defaultPrevented) {
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
			ref={panel}
			aria-label={'Media player'}
			style={{translate: `${offset.x}px ${offset.y}px`}}
			className={'fixed inset-x-0 bottom-0 z-30 max-h-[80dvh] overflow-y-auto border-t-2 border-white bg-black font-scope text-white md:absolute md:inset-x-auto md:bottom-auto md:left-0 md:top-full md:mt-4 md:w-96 md:border-2'}>
			<div
				onPointerDown={onDragStart}
				className={'flex h-8 cursor-grab touch-none select-none items-center justify-between border-b-2 border-white pl-3 text-lg active:cursor-grabbing'}>
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
					className={`range-line w-full ${FOCUS}`} />
				<label className={'flex items-center gap-3 text-sm'}>
					<span>{'VOL'}</span>
					<input
						type={'range'}
						min={0}
						max={1}
						step={0.05}
						value={volume}
						onChange={(event): void => set_volume(Number(event.target.value))}
						className={`range-line w-full ${FOCUS}`} />
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
