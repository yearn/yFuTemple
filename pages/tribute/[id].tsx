import React, {useMemo} from 'react';
import Link from 'next/link';
import {NextSeo} from 'next-seo';

import BackLink from '../../components/BackLink';
import Footer from '../../components/Footer';
import YFU_DATA, {originalSrc, thumbnailSrc} from '../../utils/data';
import {Markdown} from '../../utils/markdown';
import {usePhotoSwipe} from '../../utils/usePhotoSwipe';

import type {GetStaticPaths, GetStaticProps} from 'next';
import type {SlideData} from 'photoswipe';
import type {ReactElement} from 'react';
import type {TYFUData, TYFUDataMedia} from '../../utils/data';

type TArtwork = TYFUDataMedia & {
	width: number,
	height: number,
	// mostly see-through art, drawn against white
	isTransparent: boolean
};

type THallLink = Pick<TYFUData, 'id' | 'hall'>;

type TTributePage = {
	temple: TYFUData,
	artworks: TArtwork[],
	previous: THallLink | null,
	next: THallLink | null
};

const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';
const HALL_LINK = `border-2 border-white bg-black px-6 py-4 hover:bg-white hover:text-black ${FOCUS}`;

export default function Index({temple, artworks, previous, next}: TTributePage): ReactElement {
	const slides = useMemo((): SlideData[] => artworks.map((artwork): SlideData => ({
		src: originalSrc(artwork.image),
		width: artwork.width,
		height: artwork.height,
		alt: artwork.title,
		background: artwork.isTransparent ? 'white' : undefined
	})), [artworks]);
	const {open} = usePhotoSwipe(slides, {hasCaption: true});

	return (
		<div className={'relative -mt-1 flex w-screen flex-col overflow-hidden p-0 md:p-6'}>
			<NextSeo
				title={`${temple.tributeTitle} · yFu Temple`}
				description={temple.description.trim()} />
			<div className={'mx-auto w-full max-w-screen-xl'}>
				<div className={'flex items-center justify-between p-4 font-scope text-white md:px-0'}>
					<BackLink href={`/#${temple.id}`} label={'HOME'} />
					<a
						href={'https://discord.com/invite/yearn'}
						target={'_blank'}
						rel={'noreferrer'}
						className={`button-glowing-small bg-white text-black ${FOCUS}`}>
						{'SUBMIT'}
						<div className={'glow absolute -inset-0 rotate-180 rounded-full'} />
						<div className={'glow absolute -inset-0 rotate-180 rounded-full'} />
					</a>
				</div>
				<h1 className={'mx-auto w-fit max-w-xl whitespace-pre-wrap break-words border-b-2 border-b-white px-3 pb-3 text-center font-peste text-2xl font-medium uppercase text-white md:px-0 md:text-5xl'}>
					{temple.tributeTitle}
				</h1>
				<p className={'mx-auto mt-6 max-w-2xl px-4 text-center font-scope text-base text-white md:text-lg'}>
					{temple.description.trim()}
				</p>
				<ul className={'mt-10 columns-1 gap-6 px-4 sm:columns-2 md:px-0 lg:columns-3'}>
					{artworks.map((artwork, index): ReactElement => (
						<li key={artwork.image} className={'mb-6 break-inside-avoid border-2 border-white bg-black font-scope text-white'}>
							<button
								type={'button'}
								onClick={(): void => open(index)}
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
									className={`inline-block text-sm underline ${FOCUS}`}>
									{'Open original ↗'}
								</a>
							</div>
						</li>
					))}
				</ul>
				<nav aria-label={'Halls'} className={'mt-4 flex flex-wrap justify-between gap-4 px-4 font-scope text-white md:px-0'}>
					{previous ? <Link href={`/tribute/${previous.id}/`} className={HALL_LINK}>{`‹ ${previous.hall}`}</Link> : <span />}
					{next ? <Link href={`/tribute/${next.id}/`} className={HALL_LINK}>{`${next.hall} ›`}</Link> : null}
				</nav>
			</div>
			<Footer />
		</div>
	);
}

export const getStaticPaths: GetStaticPaths = async () => ({
	paths: YFU_DATA.map(({id}): {params: {id: string}} => ({params: {id}})),
	fallback: false
});

export const getStaticProps: GetStaticProps<TTributePage, {id: string}> = async ({params}) => {
	const {default: sharp} = await import('sharp');
	const halls = [...YFU_DATA].sort((a, b): number => a.order - b.order);
	const index = halls.findIndex(({id}): boolean => id === params?.id);
	const temple = halls[index];
	const link = (hall?: TYFUData): THallLink | null => (hall ? {id: hall.id, hall: hall.hall} : null);
	const artworks = await Promise.all(temple.medias.map(async (media): Promise<TArtwork> => {
		const image = sharp(`${process.cwd()}/public${originalSrc(media.image)}`);
		const [{width, height}, {channels: [, , , alpha]}] = await Promise.all([image.metadata(), image.stats()]);
		return {...media, width: width as number, height: height as number, isTransparent: alpha !== undefined && alpha.mean < 255 / 2};
	}));
	return {props: {temple, artworks, previous: link(halls[index - 1]), next: link(halls[index + 1])}};
};
