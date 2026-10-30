import {useEffect, useState} from 'preact/hooks';

import {pageImage, progressKey} from '../utils/comics';
import {readStorage} from '../utils/storage';

import type {VNode} from 'preact';
import type {TComic} from '../utils/comics';

type TComicsList = {
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

export default function ComicsList({issues}: TComicsList): VNode {
	// the page each issue was left on lives in this browser, so it shows up after the static render
	const [pages, set_pages] = useState<{[id: string]: number}>({});
	useEffect((): void => {
		set_pages(Object.fromEntries(issues.map(({comic}): [string, number] => [comic.id, Number(readStorage(progressKey(comic.id)))])));
	}, [issues]);

	return (
		<ol className={'grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6'}>
			{issues.map(({comic, pageCount}): VNode => {
				const {status, href, share} = progressOf(comic.id, pages[comic.id], pageCount);
				return (
					<li key={comic.id}>
						<a
							href={href}
							className={'group block border-2 border-white bg-black text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'}>
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
						</a>
					</li>
				);
			})}
		</ol>
	);
}
