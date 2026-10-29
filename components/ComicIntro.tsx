import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ComicIntro(): React.ReactElement {
	return (
		<section className={'mb-16 grid grid-cols-1 divide-y divide-white border-2 border-white md:grid-cols-3 md:divide-y-0'}>
			<div className={'relative col-span-1 flex flex-col items-center justify-center divide-y divide-white p-0 md:divide-y-0 md:p-8'}>
				<div className={'image-wrapper-full-height h-32 md:h-auto'}>
					<Image
						alt={''}
						src={'/assetsThumbnail/comic1-mark.avif'}
						loading={'eager'}
						quality={90}
						className={'aspect-square w-32 object-contain p-2 md:w-full'}
						width={497}
						height={497}
					/>
				</div>
			</div>
			<div className={'image-wrapper col-span-1 block md:hidden'}>
				<Image
					alt={''}
					src={'/assets/comic1-main.avif'}
					className={'w-full object-cover'}
					loading={'eager'}
					width={600}
					height={895}
				/>
			</div>
			<div className={'col-span-1 flex size-full flex-col border-0 border-white p-4 pb-8 md:border-x-2 md:p-8 md:pb-14'}>
				<div className={'space-y-4 font-scope text-base text-white md:text-lg'} style={{whiteSpace: 'break-spaces'}}>
					<h4 className={'mb-6 text-2xl font-bold md:text-4xl'}>{'The Comic'}</h4>
					<p>{"yFu is a comic in four episodes, set in the Pills alternate universe and chronicling the rise of Yearn's DAO and DeFi. yFu was developed by Yearn Finance and The Pills Universe, and was written and produced by Josh Blaylock."}</p>
					<p>{'yFu follows the story of Andre the Patcher and a young farmer named Estonya as they encounter the four yFu goddesses and attempt to recover the secrets of yield from the clutches of the ancient, evil Cron.'}</p>
					<p>{'Browse to see the art and story first hand.'}</p>
					<p>
						<Link href={'/faq'} className={'underline'}>
							{'See the FAQ for full credits.'}
						</Link>
					</p>
				</div>
				<div className={'mx-auto mt-8 pt-8 md:mt-auto'}>
					<Link
						href={'/comics/'}
						className={'button-glowing bg-white font-peste text-black'}>
						{'VIEW COMICS'}
						<div className={'glow absolute -inset-0 rotate-180 rounded-full'} />
						<div className={'glow absolute -inset-0 rotate-180 rounded-full'} />
					</Link>
				</div>
			</div>
			<div className={'image-wrapper col-span-1 hidden md:flex'}>
				<Image
					alt={''}
					src={'/assets/comic1-main.avif'}
					className={'w-full object-cover'}
					loading={'eager'}
					width={600}
					height={895}
				/>
			</div>
		</section>
	);
}
