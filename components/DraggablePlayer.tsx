import React from 'react';
import Draggable from 'react-draggable';
import Image from 'next/image';

import {useAudio} from '../contexts/useAudio';
import AudioPlayerSimple from './AudioPlayerSimple';

import type {ReactElement} from 'react';

type TDraggablePlayer = {
	hasMediaPlayer: boolean;
	set_hasMediaPlayer: React.Dispatch<React.SetStateAction<boolean>>,
	selected: number,
	set_selected: React.Dispatch<React.SetStateAction<number>>
};
function	DraggablePlayer({
	hasMediaPlayer,
	set_hasMediaPlayer,
	selected,
	set_selected
}: TDraggablePlayer): ReactElement {
	const	{AUDIO_LIST, set_audio} = useAudio();

	return (
		<div className={`fixed z-50 ${hasMediaPlayer ? '' : 'hidden'}`}>
			<Draggable
				handle={'.cursor-grab'}
				defaultPosition={{x: 200, y: 200}}>
				<div className={'relative z-50 flex w-96 flex-col border-2 border-b-0 border-white bg-black'}>
					<div className={'flex h-7 w-full cursor-grab flex-row justify-between border-b-2 border-white px-2 font-scope text-lg text-white'}>
						<div className={'w-full'}>{'YFU MEDIA PLAYER'}</div>
						<div
							className={'-m-1 cursor-pointer select-none p-1'}
							onClick={(): void => set_hasMediaPlayer(false)}>
							{'X'}
						</div>
					</div>
					<div className={'flex h-80 w-full border-b-2 border-white px-2 font-scope text-lg text-white'}>
						<Image
							alt={''}
							src={AUDIO_LIST[selected][2]}
							width={380}
							height={320}
							objectFit={'cover'} />
					</div>
					{AUDIO_LIST.map(([name, src], index): ReactElement => (
						<AudioPlayerSimple
							key={src}
							isSelected={selected === index}
							set_selected={(audio): void => {
								set_audio(audio);
								set_selected(index);
							}}
							onSelectNext={(): void => set_selected((index + 1) % AUDIO_LIST.length)}
							name={name}
							src={src} />
					))}
				</div>
			</Draggable>
		</div>
	);
}

export default DraggablePlayer;
