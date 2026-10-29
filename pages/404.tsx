import React from 'react';
import Link from 'next/link';
import {NextSeo} from 'next-seo';

import Footer from '../components/Footer';

import type {ReactElement} from 'react';

const LINK = 'border-2 border-white px-4 py-2 hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

export default function Custom404(): ReactElement {
	return (
		<div className={'relative -mt-1 flex w-screen flex-col overflow-hidden p-0 md:p-6'}>
			<NextSeo title={'Not found · yFu Temple'} noindex />
			<main className={'mx-auto flex min-h-[60vh] w-full max-w-xl flex-col items-center justify-center gap-6 px-4 text-center font-scope text-white'}>
				<h1 className={'font-peste text-5xl uppercase md:text-7xl'}>{'404'}</h1>
				<p className={'text-lg'}>{'This passage of the temple does not exist.'}</p>
				<div className={'flex flex-wrap justify-center gap-4'}>
					<Link href={'/'} className={LINK}>{'Back to the temple'}</Link>
					<Link href={'/comics/'} className={LINK}>{'Read the comics'}</Link>
				</div>
			</main>
			<Footer />
		</div>
	);
}
