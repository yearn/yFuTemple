import React, {useCallback, useEffect, useRef, useState} from 'react';

import {AudioContextApp, formatRemaining, useAudio} from '../contexts/useAudio';
import PlayerPanel from './PlayerPanel';
import IconPause from './icons/IconPause';
import IconPlay from './icons/IconPlay';
import IconPlaylist from './icons/IconPlaylist';
import IconPrev from './icons/IconPrev';

import type {ReactElement} from 'react';

const	LINKS = [
	['Yearn', 'https://yearn.fi'],
	['Twitter', 'https://x.com/yearnfi'],
	['Blog', 'https://blog.yearn.fi'],
	['Discord', 'https://discord.com/invite/yearn'],
	['The Blue Pill', 'https://yfistory.org/']
];

const	HEADER_BUTTON = 'flex size-8 items-center justify-center hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-white';

function	Header(): ReactElement {
	const	{tracks, current, isPlaying, progress, toggle, next, previous} = useAudio();
	const	[hasModal, set_hasModal] = useState(false);
	const	[hasMediaPlayer, set_hasMediaPlayer] = useState(false);
	const	info = useRef<HTMLDivElement>(null);
	const	infoButton = useRef<HTMLButtonElement>(null);
	const	playerButton = useRef<HTMLButtonElement>(null);
	// closing a panel from inside it puts focus back on the button that opened it
	const	closeMediaPlayer = useCallback((): void => {
		set_hasMediaPlayer(false);
		playerButton.current?.focus();
	}, []);
	const	closeInfo = useCallback((): void => {
		set_hasModal(false);
		infoButton.current?.focus();
	}, []);

	// the info panel closes on escape, a click elsewhere, or moving to another page
	useEffect((): (() => void) | void => {
		if (!hasModal) {
			return;
		}
		const close = (): void => set_hasModal(false);
		const onKeyDown = (event: KeyboardEvent): void => {
			// an open image viewer takes escape for itself
			if (event.key === 'Escape' && !event.defaultPrevented) {
				closeInfo();
			}
		};
		const onPointerDown = (event: PointerEvent): void => {
			if (!info.current?.contains(event.target as Node)) {
				close();
			}
		};
		window.addEventListener('keydown', onKeyDown);
		window.addEventListener('pointerdown', onPointerDown);
		document.addEventListener('astro:before-preparation', close);
		return (): void => {
			window.removeEventListener('keydown', onKeyDown);
			window.removeEventListener('pointerdown', onPointerDown);
			document.removeEventListener('astro:before-preparation', close);
		};
	}, [closeInfo, hasModal]);

	return (
		<>
			<header className={'fixed top-0 z-20 grid h-24 w-full grid-cols-[auto_1fr] flex-col items-center transition-[top] duration-300 motion-reduce:transition-none md:flex md:h-16 md:flex-row [html[data-chrome=hidden]_&]:-top-24 md:[html[data-chrome=hidden]_&]:-top-16'}>
				<div ref={info} className={'relative col-span-1 flex h-12 w-full items-center border-b-2 border-white bg-black md:h-full md:w-auto md:shrink-0 lg:w-68'}>
					<button
						ref={infoButton}
						type={'button'}
						onClick={(): void => set_hasModal(!hasModal)}
						aria-expanded={hasModal}
						aria-controls={'site-info'}
						className={'flex size-full items-center px-4 text-left font-scope text-xl text-white focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white md:px-6 md:text-2xl'}>
						{'INFO'}
					</button>
					{hasModal ? (
						<div id={'site-info'} className={'absolute top-full left-0 z-50 w-screen border-0 border-b-2 border-white bg-black p-4 md:w-68 md:border-2'}>
							<div className={'flex justify-end'}>
								<button
									type={'button'}
									onClick={closeInfo}
									aria-label={'Close info'}
									className={HEADER_BUTTON + ' font-scope text-lg text-white'}>
									{'X'}
								</button>
							</div>
							<div className={'flex w-full justify-center select-none'}>
								<img
									alt={''}
									src={'/yfiTree.avif'}
									width={150}
									height={186}
									loading={'lazy'}
									decoding={'async'} />
							</div>
							<p className={'mt-4 font-scope text-base text-white'}>
								{'The yFu Temple is home to '}
								<em>{'yFu'}</em>
								{', a four-issue comic about the rise of Yearn, and to the art and music made for its four goddesses. Created by the YFI Story team with Devil\'s Due Studios, in the Pills universe.'}
							</p>
							<p className={'mt-4 font-scope tracking-widest text-white'}>
								<a href={'/comics/'} className={'hover:underline'}>{'COMICS'}</a>
								{' / '}
								<a href={'/faq/'} className={'hover:underline'}>{'FAQ & CREDITS'}</a>
							</p>
							<p className={'mt-4 font-scope tracking-widest text-yblue'}>
								{LINKS.map(([label, href], index): ReactElement => (
									<React.Fragment key={label}>
										{index > 0 ? ' / ' : null}
										<a
											href={href}
											target={'_blank'}
											rel={'noreferrer'}
											className={'hover:underline'}>
											{label}
										</a>
									</React.Fragment>
								))}
							</p>
						</div>
					) : null}
				</div>
				<div className={'relative col-span-1 flex h-12 min-w-0 border-b-2 border-l-2 border-white bg-black md:h-16 md:w-auto md:min-w-75 md:shrink-0'}>
					<div className={'flex w-full min-w-0 items-center px-1 font-scope text-white md:px-3'}>
						<button
							type={'button'}
							onClick={previous}
							aria-label={'Previous track'}
							className={HEADER_BUTTON}>
							<IconPrev className={'size-3 md:size-4'} />
						</button>
						<button
							type={'button'}
							onClick={toggle}
							aria-label={isPlaying ? 'Pause' : 'Play'}
							className={HEADER_BUTTON}>
							{isPlaying ? <IconPause className={'size-3 md:size-4'} /> : <IconPlay className={'size-3 md:size-4'} />}
						</button>
						<button
							type={'button'}
							onClick={next}
							aria-label={'Next track'}
							className={HEADER_BUTTON}>
							<IconPrev className={'size-3 rotate-180 md:size-4'} />
						</button>
						<div className={'mx-2 mb-0.5 min-w-0 truncate text-xs md:mx-3 md:text-base'}>{tracks[current].title}</div>
						<div className={'mr-1 mb-0.5 ml-auto text-xs tabular-nums md:mr-3 md:text-base'}>
							{formatRemaining(progress)}
						</div>
						<button
							ref={playerButton}
							type={'button'}
							onClick={(): void => set_hasMediaPlayer(!hasMediaPlayer)}
							aria-label={hasMediaPlayer ? 'Close media player' : 'Open media player'}
							aria-expanded={hasMediaPlayer}
							className={HEADER_BUTTON}>
							<IconPlaylist />
						</button>
					</div>
					<PlayerPanel
						isOpen={hasMediaPlayer}
						onClose={closeMediaPlayer} />
				</div>
				<div className={'relative col-span-2 flex h-12 w-full items-center overflow-x-hidden border-b-2 border-white bg-[#181D20] font-scope text-white select-none md:h-16'}>
					<div className={'animate-marquee whitespace-nowrap motion-reduce:animate-none'}>
						<span className={'mx-4 text-xl md:text-2xl'}>{'THE TEMPLE IS A SACRED PLACE, DESIGNED SO THE ACOLYTES THAT REPRESENT YFI MAY COMMUNE AND WORSHIP'}</span>
					</div>
					<div aria-hidden={'true'} className={'absolute top-0 flex h-full animate-marquee2 items-center whitespace-nowrap motion-reduce:hidden'}>
						<span className={'mx-4 text-xl md:text-2xl'}>{'THE TEMPLE IS A SACRED PLACE, DESIGNED SO THE ACOLYTES THAT REPRESENT YFI MAY COMMUNE AND WORSHIP'}</span>
					</div>
				</div>
			</header>
		</>

	);
}

// the site's one audio element lives here, and the layout carries the header over to each new page
export default function SiteHeader(): ReactElement {
	return (
		<AudioContextApp>
			<Header />
		</AudioContextApp>
	);
}
