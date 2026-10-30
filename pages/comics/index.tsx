import React, {useEffect, useState} from 'react';
import Link from 'next/link';
import {NextSeo} from 'next-seo';

import BackLink from '../../components/BackLink';
import Footer from '../../components/Footer';
import {pageImage, progressKey} from '../../utils/comics';
import {COMICS} from '../../utils/comicsManifest';
import {readStorage} from '../../utils/storage';

import type {GetStaticProps} from 'next';
import type {ReactElement} from 'react';
import type {TComic} from '../../utils/comics';

type TComicsPage = {
	issues: {comic: TComic, pageCount: number}[]
};

// how far into an issue the reader got, and where its card should lead
function progressOf(id: string, page: number, pageCount: number): {status: string, href: string, share: number} {
	if (!(page > 0)) {
		return {status: `${pageCount} pages`, href: `/comics/${id}/`, share: 0};
	}
	if (page === pageCount - 1) {
		return {status: 'Read', href: `/comics/${id}/`, share: 1};
	}
	return {status: `Continue at page ${page + 1} of ${pageCount}`, href: `/comics/${id}/#page-${page + 1}`, share: (page + 1) / pageCount};
}

export default function ComicsPage({issues}: TComicsPage): ReactElement {
	// the page each issue was left on lives in this browser, so it shows up after the static render
	const [pages, set_pages] = useState<{[id: string]: number}>({});
	useEffect((): void => {
		set_pages(Object.fromEntries(issues.map(({comic}): [string, number] => [comic.id, Number(readStorage(progressKey(comic.id)))])));
	}, [issues]);

	return (
		<div className={'relative -mt-1 flex w-screen flex-col overflow-hidden p-0 md:p-6'}>
			<NextSeo
				title={'yFu Comics'}
				description={'Read all four issues of yFu, the comic about the rise of Yearn and DeFi.'} />
			<main className={'relative mx-auto w-full max-w-screen-xl px-4 md:px-0'}>
				<div className={'py-4'}>
					<BackLink href={'/'} label={'HOME'} />
				</div>
				<h1 className={'mx-auto mb-8 mt-4 w-fit border-b-2 border-white px-3 pb-3 font-peste text-3xl font-medium uppercase text-white md:text-5xl'}>
					{'yFu comics'}
				</h1>
				<ol className={'grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6'}>
					{issues.map(({comic, pageCount}): ReactElement => {
						const {status, href, share} = progressOf(comic.id, pages[comic.id], pageCount);
						return (
							<li key={comic.id}>
								<Link
									href={href}
									className={'group block border-2 border-white bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'}>
									<img
										{...pageImage(comic, 0)}
										sizes={'(min-width: 768px) 25vw, 50vw'}
										// the card's text names the issue
										alt={''}
										className={'h-auto w-full bg-white/5 transition-opacity group-hover:opacity-80'} />
									<div className={'border-t-2 border-white p-3 md:p-4'}>
										<p className={'text-sm opacity-70'}>{`Issue ${comic.number} · ${comic.title}`}</p>
										<h2 className={'text-lg md:text-xl'}>{comic.subtitle}</h2>
										<p className={'mt-1 text-sm opacity-70'}>{status}</p>
									</div>
									{share > 0 ? (
										<div className={'h-1 bg-white/20'}>
											<div className={'h-full bg-white'} style={{width: `${share * 100}%`}} />
										</div>
									) : null}
								</Link>
							</li>
						);
					})}
				</ol>
			</main>
			<Footer />
		</div>
	);
}

export const getStaticProps: GetStaticProps<TComicsPage> = async () => ({
	props: {
		issues: COMICS.map((comic): {comic: TComic, pageCount: number} => ({
			comic: {...comic, pages: comic.pages.slice(0, 1)},
			pageCount: comic.pages.length
		}))
	}
});
