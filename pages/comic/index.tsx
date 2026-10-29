import React, {useEffect, useState} from 'react';
import Link from 'next/link';

import {COMICS, pageImage} from '../../utils/comics';

import type {TComic} from '../../utils/comics';

import styles from './Carousel.module.css';

// Define a custom type for our CSS variables with the correct prefix
type TCustomCSSProperties = React.CSSProperties & {
	'--glow-color': string;
	'--glow-fade-color': string;
};

// Explicitly declare functions outside the component
function handleScroll(e: React.UIEvent<HTMLElement>, currentSlide: number, set_currentSlide: React.Dispatch<React.SetStateAction<number>>): void {
	const viewport = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
	const vw = viewport / 100;
	const target = e.target as HTMLElement;

	if (viewport > 768) {
		const slide = Math.floor(target.scrollLeft / (20 * vw));
		if (slide !== currentSlide) {
			set_currentSlide(slide);
		}
	} else {
		const slide = Math.floor((target.scrollLeft + 80) / (50 * vw));
		if (slide !== currentSlide) {
			set_currentSlide(slide);
		}
	}
}

function handleImageClick(index: number, set_modalImage: React.Dispatch<React.SetStateAction<number | null>>, set_isModalOpen: React.Dispatch<React.SetStateAction<boolean>>): void {
	set_modalImage(index);
	set_isModalOpen(true);
}

function handleModalClose(set_isModalOpen: React.Dispatch<React.SetStateAction<boolean>>, set_modalImage: React.Dispatch<React.SetStateAction<number | null>>): void {
	set_isModalOpen(false);
	set_modalImage(null);
}

export default function CarouselPage(): React.ReactElement {
	const [comic, set_comic] = useState<TComic>(COMICS[0]);
	const [currentSlide, set_currentSlide] = useState<number>(0);
	const [isShowGlow, set_isShowGlow] = useState<boolean>(false);
	const [isModalOpen, set_isModalOpen] = useState<boolean>(false);
	const [modalImage, set_modalImage] = useState<number | null>(null);
	const activeTab = comic.id;

	const tabColors: {[key: string]: string} = {
		techne: 'rgba(18, 201, 205, 0.8)',
		transmission: 'rgba(230, 236, 117, 0.8)',
		community: 'rgba(238, 166, 208, 0.8)',
		dominion: 'rgba(227, 111, 76, 0.8)'
	};

	useEffect((): (() => void) => {
		const showGlowEffect = (): () => void => {
			set_isShowGlow(true);
			const timeout = setTimeout((): void => {
				set_isShowGlow(false);
			}, 1000);
			return (): void => {
				clearTimeout(timeout);
			};
		};

		return showGlowEffect();
	}, [activeTab]);

	const styleProps: TCustomCSSProperties = {
		'--glow-color': tabColors[activeTab],
		'--glow-fade-color': tabColors[activeTab].replace('0.8', '0.2')
	};

	return (
		<article className={'relative flex h-screen flex-col overflow-hidden p-0 md:p-6'}>
			<div className={'flex h-12 flex-row items-center justify-between border-b-2 border-b-white px-4 md:hidden'}>
				<Link href={'/'}>
					<div className={'flex cursor-pointer flex-row items-center'}>
						<p className={'mr-1 font-scope text-xl text-white'}>{'<'}</p>
						<p className={'mt-1 font-scope text-xl text-white'}>{'BACK'}</p>
					</div>
				</Link>
			</div>

			<div className={'absolute inset-x-6 top-4 hidden flex-row items-center justify-between md:flex lg:mr-4'}>
				<Link href={'/'}>
					<div className={'cursor-pointer flex-row items-center md:flex'}>
						<p className={'mr-1 font-scope text-5xl text-white'}>{'<'}</p>
						<p className={'mt-3 font-scope text-2xl text-white'}>{'BACK'}</p>
					</div>
				</Link>
			</div>
			<h3 className={'mx-auto mt-4 w-fit max-w-xl whitespace-pre-wrap break-words border-b-2 border-b-white px-3 pb-3 font-peste text-2xl font-medium uppercase text-white md:mt-0 md:px-0 md:text-5xl'}>
				{'yFu comics'}
			</h3>

			<article
				className={`${styles.backgroundGlow} ${isShowGlow ? styles.glowFadeIn : styles.glowFadeOut}`}
				style={styleProps}
			/>

			<article className={'z-10 flex flex-col items-stretch justify-between space-y-4 overflow-hidden p-4 py-8 sm:space-y-16'}>

				<section className={'mb-4 flex w-full justify-center gap-x-1 sm:gap-x-4'}>
					{(() => {
						const disabledTabs = ['transmission', 'community', 'dominion'];
						return (
							COMICS.map(({id: tab}, index) => (
								<button
									key={tab}
									onClick={(): void => {
										set_comic(COMICS[index]);
										set_currentSlide(0);
									}}
									className={`rounded-md px-2 py-1 text-sm capitalize ${activeTab === tab ? 'bg-white/30' : disabledTabs.includes(tab) ? 'cursor-not-allowed text-white/70' : 'text-white'}`}
									disabled={disabledTabs.includes(tab)} // Use disabledTabs here
								>
									{disabledTabs.includes(tab) ? '🔒 ' : ''}{tab}
								</button>
							))
						);
					})()}
				</section>


				<section
					id={'image-carousel'}
					className={'horizontal-snap scrollbar-none w-screen gap-0 scroll-smooth px-20 md:px-[40vw]'}
					onScroll={(e): void => handleScroll(e, currentSlide, set_currentSlide)}
				>
					{comic.pages.map((_page, index) => (
						<div
							key={index}
							className={`w-[50vw] md:w-[20vw] ${
								currentSlide === index ? 'horizontal-snap-center' : currentSlide > index ? 'horizontal-snap-on-left' : 'horizontal-snap-on-right'
							}`}
						>
							<div className={'figure select-none'}>
								<div className={'carousel-slider-animate-opacity'}>
									<img
										{...pageImage(comic, index)}
										alt={`${comic.title} page ${index + 1}`}
										sizes={'(min-width: 768px) 20vw, 50vw'}
										style={{objectFit: 'contain'}}
										loading={'lazy'}
										decoding={'async'}
										className={'cursor-pointer'}
										onClick={(): void => handleImageClick(index, set_modalImage, set_isModalOpen)}
									/>
								</div>
							</div>
						</div>
					))}

					{comic.pages.length < 5
						? Array(5 - comic.pages.length).fill(<div className={'w-[50vw] md:w-[20vw]'}/>)
						: null}
				</section>
			</article>

			{isModalOpen && modalImage !== null && (
				<div
					className={'fixed inset-0 z-50 flex items-center justify-center bg-black/80'}
					onClick={(): void => handleModalClose(set_isModalOpen, set_modalImage)}
				>
					<div className={'relative p-4'}>
						<img
							{...pageImage(comic, modalImage)}
							alt={`${comic.title} page ${modalImage + 1}`}
							sizes={'100vw'}
							style={{
								objectFit: 'contain',
								maxHeight: 'calc(100vh - 80px)',
								maxWidth: '100%'
							}}
						/>
					</div>
				</div>
			)}
		</article>
	);
}
