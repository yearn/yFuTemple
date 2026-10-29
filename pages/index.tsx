import React, {useCallback} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/router';

import ComicIntro from '../components/ComicIntro';
import Footer from '../components/Footer';
import Title from '../components/Title';
import YFU_DATA from '../utils/data';

import type {ReactElement} from 'react';
import type {TYFUData} from '../utils/data';

function Goddess({characterSrc = '', typoSrc = '', id = '', title = '', children = <div/>}): ReactElement {
	const router = useRouter();

	const onClickTribute = useCallback((id: string): void => {
		console.log('routing', `/tribute/${id}`);
		router.push(`/tribute/${id}`);
	}, [router]);

	return (
		<div className={'grid grid-cols-1 divide-y divide-white border-2 border-white md:grid-cols-3 md:divide-y-0'}>
			<div
				className={'relative col-span-1 flex flex-col items-center justify-center divide-y divide-white p-0 md:divide-y-0 md:p-8'}>
				<div className={'image-wrapper-full-height h-32 md:h-auto'}>
					<Image
						alt={''}
						src={typoSrc}
						loading={'eager'}
						quality={90}
						className={'aspect-square w-32 object-contain p-2 md:w-full'}
						width={497}
						height={497} />
				</div>
			</div>
			<div className={'image-wrapper col-span-1 block md:hidden'}>
				<Image
					alt={''}
					src={characterSrc}
					className={'w-full object-cover'}
					loading={'eager'}
					width={600}
					height={895}/>
			</div>
			<div
				className={'col-span-1 flex size-full flex-col border-0 border-white p-4 pb-8 md:border-x-2 md:p-8 md:pb-14'}>
				<div
					className={'space-y-4 font-scope text-base text-white md:text-lg'}
					style={{whiteSpace: 'break-spaces'}}>
					<h4 className={'mb-6 text-2xl font-bold md:text-4xl'}>{title}</h4>
					{children}
				</div>
				<div className={'mx-auto mt-8 pt-8 md:mt-auto'}>
					<button
						onClick={(): void => onClickTribute(id)}
						className={'button-glowing bg-white font-peste text-black'}>
						{'SEE TRIBUTES'}
						<div className={'glow absolute -inset-0 rotate-180 rounded-full'}/>
						<div className={'glow absolute -inset-0 rotate-180 rounded-full'}/>
					</button>
				</div>
			</div>
			<div className={'image-wrapper col-span-1 hidden md:flex'}>
				<Image
					alt={''}
					src={characterSrc}
					className={'w-full object-cover'}
					loading={'eager'}
					width={600}
					height={895}/>
			</div>
		</div>
	);
}

function Tree(): ReactElement {
	return (
		<div className={'grid grid-cols-1 border-2 border-white'}>
			<div className={'image-wrapper col-span-1'}>
				<Image
					alt={''}
					src={'/yearningTree.avif'}
					loading={'eager'}
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
						<Title/>
					</div>

					<section className={'w-full px-4 md:px-0'}>
						<ComicIntro/>

						{allData
							.sort((a: TYFUData, b: TYFUData): number => a.order - b.order)
							.map((goddess: TYFUData, index: number): ReactElement => (
								<div key={goddess.id}>
									<Goddess
										id={goddess.id}
										title={goddess.title}
										characterSrc={goddess.mainIllustration}
										typoSrc={goddess.watermark}>
										<p>{goddess.description}</p>
									</Goddess>
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
