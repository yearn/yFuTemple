import React, {useCallback, useEffect, useState} from 'react';
import Image from 'next/image';

import {formatRemaining, useAudio} from '../contexts/useAudio';
import PlayerPanel from './PlayerPanel';
import IconExpand from './icons/IconExpand';
import IconPause from './icons/IconPause';
import IconPlay from './icons/IconPlay';
import IconPrev from './icons/IconPrev';

import type {ReactElement} from 'react';

const	LINKS = [
	['Twitter', 'https://x.com/yearnfi'],
	['Blog', 'https://blog.yearn.fi'],
	['Discord', 'https://discord.com/invite/yearn']
];

const	HEADER_BUTTON = 'flex size-6 items-center justify-center hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-white md:size-8';

function	Header(): ReactElement {
	const	{tracks, current, isPlaying, progress, toggle, next, previous} = useAudio();
	const	[hasModal, set_hasModal] = useState(false);
	const	[hasMediaPlayer, set_hasMediaPlayer] = useState(false);
	const	closeMediaPlayer = useCallback((): void => set_hasMediaPlayer(false), []);

	useEffect((): (() => void) | void => {
		if (!hasModal) {
			return;
		}
		const onKeyDown = (event: KeyboardEvent): void => {
			if (event.key === 'Escape') {
				set_hasModal(false);
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return (): void => window.removeEventListener('keydown', onKeyDown);
	}, [hasModal]);

	return (
		<>
			<header className={'fixed top-0 z-20 grid h-24 w-full grid-cols-2 flex-col items-center md:flex md:h-16 md:flex-row'}>
				<div className={'relative col-span-1 flex h-12 w-full items-center border-b-2 border-white bg-black md:h-full md:w-68 md:min-w-68'}>
					<button
						type={'button'}
						onClick={(): void => set_hasModal(!hasModal)}
						aria-expanded={hasModal}
						aria-controls={'site-info'}
						className={'flex size-full items-center px-4 text-left font-scope text-xl text-white focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white md:text-2xl'}>
						{'INFO'}
					</button>
					{hasModal ? (
						<div id={'site-info'} className={'absolute left-0 top-full z-50 w-[200%] border-0 border-b-2 border-white bg-black p-4 md:w-full md:border-2'}>
							<div className={'flex justify-end'}>
								<button
									type={'button'}
									onClick={(): void => set_hasModal(false)}
									aria-label={'Close info'}
									className={HEADER_BUTTON + ' font-scope text-lg text-white'}>
									{'X'}
								</button>
							</div>
							<div className={'flex w-full select-none justify-center'}>
								<Image
									alt={''}
									src={'/yfiTree.avif'}
									width={150}
									height={186} />
							</div>
							<div className={'mt-4 space-y-1 font-scope tracking-widest text-yblue'}>
								<p>
									{'Find us: '}
									<a
										href={'https://yearn.fi'}
										target={'_blank'}
										rel={'noreferrer'}
										className={'hover:underline'}>
										{'YEARN'}
									</a>
								</p>
								<p>
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
								<p className={'font-bluepill'}>
									<a
										href={'https://yfistory.org/'}
										target={'_blank'}
										rel={'noreferrer'}
										className={'text-xl tracking-normal hover:underline'}>
										{'The Blue Pill'}
									</a>
								</p>
							</div>
						</div>
					) : null}
				</div>
				<div className={'relative col-span-1 flex h-12 min-w-0 border-b-2 border-l-2 border-white bg-black md:h-16 md:w-[300px] md:min-w-[300px]'}>
					<div className={'flex w-max items-center justify-between px-1 font-scope text-white md:px-3'}>
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
						<div className={'mx-2 mb-0.5 flex text-xs md:mx-3 md:text-base'}>{tracks[current].title}</div>
						<div className={'mb-0.5 mr-1 text-xs tabular-nums md:mr-3 md:text-base'}>
							{formatRemaining(progress)}
						</div>
						<button
							type={'button'}
							onClick={(): void => set_hasMediaPlayer(!hasMediaPlayer)}
							aria-label={hasMediaPlayer ? 'Close media player' : 'Open media player'}
							aria-expanded={hasMediaPlayer}
							className={HEADER_BUTTON}>
							<IconExpand />
						</button>
					</div>
				</div>
				<div className={'relative col-span-2 flex h-12 w-full select-none items-center overflow-x-hidden border-b-2 border-white bg-[#181D20] font-scope text-white md:h-16'}>
					<div className={'animate-marquee whitespace-nowrap motion-reduce:animate-none'}>
						<span className={'mx-4 text-xl md:text-2xl'}>{'THE TEMPLE IS A SACRED PLACE, DESIGNED SO THE ACOLYTES THAT REPRESENT YFI MAY COMMUNE AND WORSHIP'}</span>
					</div>
					<div className={'absolute top-0 flex h-full animate-marquee2 items-center whitespace-nowrap motion-reduce:hidden'}>
						<span className={'mx-4 text-xl md:text-2xl'}>{'THE TEMPLE IS A SACRED PLACE, DESIGNED SO THE ACOLYTES THAT REPRESENT YFI MAY COMMUNE AND WORSHIP'}</span>
					</div>
				</div>
			</header>
			<PlayerPanel
				isOpen={hasMediaPlayer}
				onClose={closeMediaPlayer} />
		</>

	);
}

export default Header;
