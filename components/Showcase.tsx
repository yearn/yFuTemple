import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

import type {ReactElement, ReactNode} from 'react';

type TShowcaseImage = {
	src: string,
	width: number,
	height: number
};

type TShowcase = {
	title: string,
	mark: TShowcaseImage,
	art: TShowcaseImage & {alt: string},
	href: string,
	cta: string,
	priority?: boolean,
	children: ReactNode
};

// phones and tablets put the mark over the text, with the art below or beside it; wide screens use three columns
export default function Showcase({title, mark, art, href, cta, priority = false, children}: TShowcase): ReactElement {
	return (
		<div className={'grid grid-cols-1 border-2 border-white md:grid-cols-2 xl:grid-cols-3'}>
			<div className={'row-start-1 flex items-center justify-center px-4 pt-6 md:col-start-1 md:border-r-2 md:border-white md:px-0 md:pt-8 xl:border-r-0 xl:p-8'}>
				<Image
					alt={''}
					src={mark.src}
					priority={priority}
					className={'h-24 w-auto max-w-full object-contain md:aspect-square md:h-auto md:w-40 md:p-2 xl:w-full'}
					width={mark.width}
					height={mark.height} />
			</div>
			<div className={'row-start-2 flex flex-col border-b-2 border-white p-4 pb-8 md:col-start-1 md:border-b-0 md:border-r-2 md:p-8 md:pb-14 xl:col-start-2 xl:row-start-1 xl:border-x-2'}>
				<div
					className={'space-y-4 font-scope text-base text-white md:text-lg'}
					style={{whiteSpace: 'break-spaces'}}>
					<h2 className={'mb-6 text-2xl font-bold md:text-4xl'}>{title}</h2>
					{children}
				</div>
				<div className={'mx-auto mt-8 pt-8 md:mt-auto'}>
					<Link
						href={href}
						aria-label={`${cta}: ${title}`}
						className={'button-glowing bg-white font-peste text-black'}>
						{cta}
						<div className={'glow absolute -inset-0 rotate-180 rounded-full'} />
						<div className={'glow absolute -inset-0 rotate-180 rounded-full'} />
					</Link>
				</div>
			</div>
			<div className={'row-start-3 flex md:col-start-2 md:row-span-2 md:row-start-1 xl:col-start-3 xl:row-span-1'}>
				<Image
					alt={art.alt}
					src={art.src}
					priority={priority}
					className={'w-full object-cover'}
					width={art.width}
					height={art.height} />
			</div>
		</div>
	);
}
