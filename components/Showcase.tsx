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
	eager?: boolean,
	children: ReactNode
};

// phones stack mark, art and text; tablets put the mark over the text beside the art; desktops use three columns
export default function Showcase({title, mark, art, href, cta, eager = false, children}: TShowcase): ReactElement {
	const loading = eager ? 'eager' : 'lazy';
	return (
		<div className={'grid grid-cols-1 border-2 border-white md:grid-cols-2 lg:grid-cols-3'}>
			<div className={'row-start-1 flex items-center justify-center border-b-2 border-white md:col-start-1 md:border-b-0 md:border-r-2 md:pt-8 lg:border-r-0 lg:p-8'}>
				<Image
					alt={''}
					src={mark.src}
					loading={loading}
					className={'aspect-square w-32 object-contain p-2 md:w-40 lg:w-full'}
					width={mark.width}
					height={mark.height} />
			</div>
			<div className={'row-start-3 flex flex-col p-4 pb-8 md:col-start-1 md:row-start-2 md:border-r-2 md:border-white md:p-8 md:pb-14 lg:col-start-2 lg:row-start-1 lg:border-x-2'}>
				<div
					className={'space-y-4 font-scope text-base text-white md:text-lg'}
					style={{whiteSpace: 'break-spaces'}}>
					<h2 className={'mb-6 text-2xl font-bold md:text-4xl'}>{title}</h2>
					{children}
				</div>
				<div className={'mx-auto mt-8 pt-8 md:mt-auto'}>
					<Link
						href={href}
						className={'button-glowing bg-white font-peste text-black'}>
						{cta}
						<div className={'glow absolute -inset-0 rotate-180 rounded-full'} />
						<div className={'glow absolute -inset-0 rotate-180 rounded-full'} />
					</Link>
				</div>
			</div>
			<div className={'row-start-2 flex border-b-2 border-white md:col-start-2 md:row-span-2 md:row-start-1 md:border-b-0 lg:col-start-3 lg:row-span-1'}>
				<Image
					alt={art.alt}
					src={art.src}
					loading={loading}
					className={'w-full object-cover'}
					width={art.width}
					height={art.height} />
			</div>
		</div>
	);
}
