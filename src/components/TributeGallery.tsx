import {useMemo, useRef} from 'preact/hooks';

import {originalSrc, thumbnailSrc} from '../utils/data';
import {Markdown} from '../utils/markdown';
import {usePhotoSwipe} from '../utils/usePhotoSwipe';

import type {SlideData} from 'photoswipe';
import type {VNode} from 'preact';
import type {TYFUDataMedia} from '../utils/data';

export type TArtwork = TYFUDataMedia & {
	width: number,
	height: number,
	// mostly see-through art, drawn against white
	isTransparent: boolean
};

const FOCUS = 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

export default function TributeGallery({artworks}: {artworks: TArtwork[]}): VNode {
	const slides = useMemo((): SlideData[] => artworks.map((artwork): SlideData => ({
		src: originalSrc(artwork.image),
		width: artwork.width,
		height: artwork.height,
		alt: artwork.title,
		background: artwork.isTransparent ? 'white' : undefined
	})), [artworks]);
	const {open} = usePhotoSwipe(slides, {hasCaption: true});
	const grid = useRef<HTMLUListElement>(null);

	// the grid is masonry, so the viewer steps through the artwork in the order it appears on screen, row by row
	function openInView(index: number): void {
		const order = Array.from(grid.current?.children ?? [], (card, i): {i: number, top: number, left: number} => {
			const {top, left} = card.getBoundingClientRect();
			return {i, top: Math.round(top), left};
		}).sort((a, b): number => a.top - b.top || a.left - b.left).map(({i}): number => i);
		open(order.indexOf(index), order.map((i): SlideData => slides[i]));
	}

	return (
		<ul ref={grid} className={'mt-10 columns-1 gap-6 px-4 sm:columns-2 md:px-0 lg:columns-3'}>
			{artworks.map((artwork, index): VNode => (
				<li key={artwork.image} className={'mb-6 break-inside-avoid border-2 border-white bg-black font-scope text-white'}>
					<button
						type={'button'}
						onClick={(): void => openInView(index)}
						aria-label={`Zoom into ${artwork.title}`}
						className={`block w-full cursor-zoom-in ${artwork.isTransparent ? 'bg-white' : ''} ${FOCUS}`}>
						<img
							src={thumbnailSrc(artwork.image)}
							width={artwork.width}
							height={artwork.height}
							alt={artwork.title}
							loading={index < 3 ? 'eager' : 'lazy'}
							decoding={'async'}
							className={'h-auto w-full'} />
					</button>
					<div className={'space-y-3 border-t-2 border-white p-4'}>
						<h2 className={'text-lg md:text-xl'}>{artwork.title}</h2>
						{artwork.description ? <Markdown text={artwork.description} className={'space-y-3 text-sm md:text-base'} /> : null}
						<a
							href={originalSrc(artwork.image)}
							target={'_blank'}
							rel={'noreferrer'}
							className={`block w-fit text-sm underline ${FOCUS}`}>
							{'Open original'}
							<span aria-hidden={'true'}>{' ↗'}</span>
						</a>
					</div>
				</li>
			))}
		</ul>
	);
}
