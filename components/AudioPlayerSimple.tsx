import React, {useEffect, useState} from 'react';

import {formatRemaining, useAudio, useAudioProgress} from '../contexts/useAudio';
import IconPause from './icons/IconPause';
import IconPlay from './icons/IconPlay';
import IconPrev from './icons/IconPrev';

type TAudioPlayerSimple = {
	name: string,
	src: string,
	isSelected: boolean,
	set_selected: (audio: HTMLAudioElement) => void,
	onSelectNext: () => void
};

function	AudioPlayerSimple({
	name,
	src,
	isSelected,
	set_selected,
	onSelectNext
}: TAudioPlayerSimple): React.ReactElement {
	const	{set_audio, isPlaying, set_isPlaying} = useAudio();
	const	[element, set_element] = useState<HTMLAudioElement | null>(null);
	const	progress = useAudioProgress(element);
	const	[isInitialLoad, set_isInitialLoad] = useState(true);

	useEffect((): void => {
		if (element && !isSelected) {
			element.currentTime = 0;
			element.pause();
		} else if (element && isSelected) {
			set_selected(element);
			if (!isInitialLoad) {
				element.play();
			}
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isSelected, element]);

	useEffect((): void => {
		setTimeout((): void => set_isInitialLoad(false), 100);
	}, [isInitialLoad]);

	function onSeek(e: React.MouseEvent<HTMLDivElement>): void {
		if (element && progress.duration) {
			const rect = e.currentTarget.getBoundingClientRect();
			element.currentTime = progress.duration * (e.clientX - rect.left) / rect.width;
		}
	}

	function renderLayout(): React.ReactElement {
		if (!isSelected) {
			return (
				<>
					<div className={'flex flex-row items-center justify-center'}>
						<IconPlay
							onClick={(): void => {
								if (element) {
									set_selected(element);
									set_isPlaying(true);
									set_audio(element);
									element.play();
								}
							}}
							className={'cursor-pointer'}/>
					</div>
					<div className={'flex w-full'}>{name}</div>
				</>
			);
		}
		return (
			<>
				<div className={'flex flex-row items-center justify-center'}>
					<IconPrev
						onClick={(): void => {
							if (element) {
								element.currentTime = 0;
							}
						}}
						className={'cursor-pointer'} />
					{isPlaying ? (
						<IconPause
							onClick={(): void => {
								set_isPlaying(false);
								element?.pause();
							}}
							className={'mx-2 cursor-pointer'}/>
					) : (
						<IconPlay
							onClick={(): void => {
								set_isPlaying(true);
								element?.play();
							}}
							className={'mx-2 cursor-pointer'}/>
					)}
					<IconPrev
						onClick={(): void => onSelectNext()}
						className={'-ml-1 rotate-180 cursor-pointer'}/>
				</div>
				<div className={'flex w-full'}>{name}</div>
			</>
		);
	}

	return (
		<div className={'flex h-8 w-full flex-row items-center space-x-2 border-b-2 border-white px-2 font-scope text-base text-white'}>
			{renderLayout()}
			<div className={'relative w-full'} style={!isSelected ? {opacity: 0} : {}}>
				<div className={'relative flex w-full flex-row items-center justify-center space-x-2'}>
					<div onClick={onSeek} className={'-my-2 w-full cursor-pointer py-2'}>
						<div className={'relative w-full bg-white'} style={{height: 1}}>
							<div
								className={'absolute h-4 bg-white transition-all'}
								style={{width: 1, top: -8, left: `${progress.currentTime / (progress.duration || 1) * 100}%`}} />
						</div>
					</div>
					<div className={'font-scope tabular-nums text-white'}>
						{formatRemaining(progress)}
					</div>
					<audio
						ref={set_element}
						src={src}
						preload={isSelected ? 'metadata' : 'none'} />
				</div>
			</div>
		</div>
	);
}

export default AudioPlayerSimple;
