import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import Footer from '../components/Footer';
import Showcase from '../components/Showcase';
import Title from '../components/Title';
import YFU_DATA from '../utils/data';

import type {ReactElement} from 'react';
import type {TYFUData} from '../utils/data';

function Tree(): ReactElement {
	return (
		<div className={'grid grid-cols-1 border-2 border-white'}>
			<div className={'col-span-1'}>
				<Image
					alt={'The Yearning Tree'}
					src={'/yearningTree.avif'}
					loading={'lazy'}
					width={2000}
					height={1000}/>
			</div>
			<div className={'col-span-1 p-4 text-left font-scope text-base text-white md:p-6 md:text-center'}>
				<p>{'The YFI faction is guided by the four yFu, who interpret the knowledge of the Yearning Tree - an ancient being who hears the desires of creatures across the universe - and responds by growing yield-bearing seeds containing the answers to their wishes'}</p>
			</div>
		</div>
	);
}

function Index(): ReactElement {
	const allData = YFU_DATA;

	return (
		<div className={'relative -mt-1 flex w-screen flex-col overflow-hidden p-0 md:p-6'}>
			<main
				id={'app'}
				className={'relative mx-auto w-full max-w-screen-xl'}
				style={{minHeight: '100vh'}}>
				<div>
					<div className={'grid justify-items-end p-4 md:px-4 md:py-1'}>
						<div></div>
						<Link
							href={'/comics/'}
							className={'button-glowing-small bg-white font-scope text-black'}>
							{'VIEW THE COMICS'}
							<div className={'glow absolute -inset-0 rotate-180 rounded-full'} />
							<div className={'glow absolute -inset-0 rotate-180 rounded-full'} />
						</Link>
					</div>

					<div className={'flex items-center justify-center pb-8 pt-2 md:pt-4'}>
						<h1>
							<span className={'sr-only'}>{'yFu Temple'}</span>
							<span aria-hidden={'true'}><Title/></span>
						</h1>
					</div>

					<section className={'w-full px-4 md:px-0'}>
						<div className={'mb-16'}>
							<Showcase
								title={'The Comic'}
								mark={{src: '/assetsThumbnail/comic1-mark.avif', width: 1000, height: 143}}
								art={{src: '/assets/comic1-main.avif', width: 959, height: 1667, alt: ''}}
								href={'/comics/'}
								cta={'VIEW COMICS'}
								eager>
								<p>{"yFu is a comic in four episodes, set in the Pills alternate universe and chronicling the rise of Yearn's DAO and DeFi. yFu was developed by Yearn Finance and The Pills Universe, and was written and produced by Josh Blaylock."}</p>
								<p>{'yFu follows the story of Andre the Patcher and a young farmer named Estonya as they encounter the four yFu goddesses and attempt to recover the secrets of yield from the clutches of the ancient, evil Cron.'}</p>
								<p>{'Browse to see the art and story first hand.'}</p>
								<p>
									<Link href={'/faq/'} className={'underline'}>
										{'See the FAQ for full credits.'}
									</Link>
								</p>
							</Showcase>
						</div>

						{allData
							.sort((a: TYFUData, b: TYFUData): number => a.order - b.order)
							.map((goddess: TYFUData, index: number): ReactElement => (
								<div key={goddess.id}>
									<Showcase
										title={goddess.title}
										mark={{src: goddess.watermark, width: 497, height: 497}}
										art={{src: goddess.mainIllustration, width: 600, height: 895, alt: goddess.title}}
										href={`/tribute/${goddess.id}/`}
										cta={'SEE TRIBUTES'}>
										<p>{goddess.description}</p>
									</Showcase>
									<div
										className={`my-0 flex items-center justify-center ${index + 1 === allData.length ? 'hidden' : ''}`}>
										<Image
											unoptimized
											alt={''}
											src={`/divider-${index + 1}.gif`}
											width={200}
											height={200}/>
									</div>
								</div>
							))}
						<div className={'my-9 flex items-center justify-center'}>
							<Image
								alt={''}
								src={'/yfiTree2.avif'}
								width={112}
								height={112}/>
						</div>
						<Tree/>
					</section>
				</div>
			</main>
			<Footer/>
		</div>
	);
}

export default Index;
