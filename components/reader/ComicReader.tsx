import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import Link from 'next/link';

import {fullPageSrc, pageAlt, pageImage} from '../../utils/comics';
import {usePhotoSwipe} from '../../utils/usePhotoSwipe';

import type {SlideData} from 'photoswipe';
import type {ReactElement} from 'react';
import type {TComic, TComicSummary} from '../../utils/comics';

type TMode = 'scroll' | 'page';

type TScrollTarget = {
	index: number,
	smooth: boolean
};

type TComicReader = {
	comic: TComic,
	next: TComicSummary | null
};

const MODE_KEY = 'reader-mode';
const MODES: [TMode, string][] = [['scroll', 'Scroll'], ['page', 'Pages']];
const SCROLL_SIZES = '(min-width: 768px) 768px, 100vw';
// a fitted page is about 0.65 times the height it is given
const PAGE_SIZES = '(orientation: landscape) 60vh, 100vw';
const STEPS: {[key: string]: number} = {ArrowRight: 1, ArrowLeft: -1, j: 1, k: -1};
// scrolling has settled once no scroll event arrived for this long
const SETTLE_MS = 100;
// scroll movement smaller than this doesn't show or hide the header
const CHROME_SLACK = 8;
const PAGE_MODE_STEPS: {[key: string]: number} = {'PageDown': 1, 'PageUp': -1, ' ': 1};
const FOCUS = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';
const CONTROL = `border-2 border-white px-3 py-1 hover:bg-white hover:text-black disabled:pointer-events-none disabled:opacity-40 aria-pressed:bg-white aria-pressed:text-black ${FOCUS}`;

// storage can be unavailable (blocked site data, some private modes), and the reader works without it
function readStorage(key: string): string | null {
	try {
		return window.localStorage.getItem(key);
	} catch {
		return null;
	}
}

function writeStorage(key: string, value: string): void {
	try {
		window.localStorage.setItem(key, value);
	} catch {
		// nothing to remember then
	}
}

function pageFromHash(hash: string, count: number): number | null {
	const page = Number(hash.match(/^#page-(\d+)$/)?.[1]);
	return page >= 1 && page <= count ? page - 1 : null;
}

// the page under the middle of the screen, or the last one once the bottom is reached
function pageInView(): number {
	const pages = Array.from(document.querySelectorAll('[data-page]'));
	if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1) {
		return pages.length - 1;
	}
	const above = pages.filter((page): boolean => page.getBoundingClientRect().top <= window.innerHeight / 2);
	return Math.max(above.length - 1, 0);
}

function isOnScreen(index: number): boolean {
	const rect = document.querySelector(`[data-page="${index}"]`)?.getBoundingClientRect();
	return rect !== undefined && rect.bottom > 0 && rect.top < window.innerHeight;
}

function EndOfIssue({next}: {next: TComicSummary | null}): ReactElement {
	return (
		<div className={'mx-auto max-w-3xl px-4 pb-16 pt-8 text-center'}>
			{next ? (
				<Link href={`/comics/${next.id}/`} className={`inline-block border-2 border-white px-6 py-4 hover:bg-white hover:text-black ${FOCUS}`}>
					{`Next: Issue ${next.number} · ${next.title}`}
					<span className={'block text-sm opacity-70'}>{next.subtitle}</span>
				</Link>
			) : (
				<Link href={'/comics/'} className={`inline-block border-2 border-white px-6 py-4 hover:bg-white hover:text-black ${FOCUS}`}>
					{'Back to all comics'}
				</Link>
			)}
		</div>
	);
}

export default function ComicReader({comic, next}: TComicReader): ReactElement {
	const count = comic.pages.length;
	const positionKey = `reader-page-${comic.id}`;
	const [mode, set_mode] = useState<TMode>('scroll');
	const [index, set_index] = useState(0);
	const [scrollTarget, set_scrollTarget] = useState<TScrollTarget | null>(null);
	const [resumeFrom, set_resumeFrom] = useState<number | null>(null);
	const [isReady, set_isReady] = useState(false);
	// a page the reader jumped to, which stays current while it is on screen even if it can't reach the middle
	const jumpedTo = useRef<number | null>(null);

	const goTo = useCallback((target: number, smooth = false): void => {
		const page = Math.min(Math.max(target, 0), count - 1);
		set_index(page);
		set_scrollTarget({index: page, smooth});
	}, [count]);

	const slides = useMemo((): SlideData[] => comic.pages.map((page, i): SlideData => ({
		src: fullPageSrc(comic, i),
		srcset: pageImage(comic, i).srcSet,
		width: page.width,
		height: page.height,
		alt: pageAlt(comic, i, count)
	})), [comic, count]);
	// follow the zoomed page, and land on it when zoom closes
	const {open: openZoom, isOpen: isZoomOpen} = usePhotoSwipe(slides, {
		onChange: set_index,
		onClose: (page): void => set_scrollTarget({index: page, smooth: false})
	});

	// the reader places the page itself, the browser restoring the old offset on reload would undo a deep link
	useEffect((): (() => void) => {
		const previous = window.history.scrollRestoration;
		window.history.scrollRestoration = 'manual';
		return (): void => {
			window.history.scrollRestoration = previous;
		};
	}, []);

	// an explicit #page-N link wins, otherwise offer to resume where the reader left off
	useEffect((): void => {
		const savedMode = readStorage(MODE_KEY);
		if (savedMode === 'scroll' || savedMode === 'page') {
			set_mode(savedMode);
		}
		const linked = pageFromHash(window.location.hash, count);
		if (linked !== null) {
			goTo(linked);
		} else {
			const saved = Number(readStorage(positionKey));
			if (saved > 0 && saved < count) {
				set_resumeFrom(saved);
			}
		}
		set_isReady(true);
	}, [count, goTo, positionKey]);

	useEffect((): void => {
		if (scrollTarget === null) {
			return;
		}
		if (mode === 'scroll') {
			jumpedTo.current = scrollTarget.index;
			document.getElementById(`page-${scrollTarget.index + 1}`)?.scrollIntoView({behavior: scrollTarget.smooth ? 'smooth' : 'instant'});
		} else {
			window.scrollTo({top: 0, behavior: 'instant'});
		}
		set_scrollTarget(null);
	}, [mode, scrollTarget]);

	// in scroll mode the current page is read once scrolling settles, so the reader's own smooth scrolls don't fight it
	useEffect((): (() => void) | void => {
		if (mode !== 'scroll') {
			return;
		}
		let timer = 0;
		const onSettled = (): void => {
			const target = jumpedTo.current;
			jumpedTo.current = null;
			set_index(target !== null && isOnScreen(target) ? target : pageInView());
		};
		const onScroll = (): void => {
			window.clearTimeout(timer);
			timer = window.setTimeout(onSettled, SETTLE_MS);
		};
		window.addEventListener('scroll', onScroll, {passive: true});
		return (): void => {
			window.clearTimeout(timer);
			window.removeEventListener('scroll', onScroll);
		};
	}, [mode]);

	// keep the url shareable and remember the page, and keep a resume offer and its page until the reader takes it or reads past it
	useEffect((): void => {
		if (!isReady) {
			return;
		}
		const hash = index === 0 ? '' : `#page-${index + 1}`;
		if (window.location.hash !== hash) {
			// next keeps its own copy of the address in history and restores it on back, so it follows the page too
			const path = `${window.location.pathname}${hash}`;
			window.history.replaceState({...window.history.state, as: path}, '', path);
		}
		if (resumeFrom !== null && index < resumeFrom) {
			return;
		}
		set_resumeFrom(null);
		writeStorage(positionKey, String(index));
	}, [index, isReady, positionKey, resumeFrom]);

	useEffect((): (() => void) => {
		const onHashChange = (): void => {
			const linked = pageFromHash(window.location.hash, count);
			if (linked !== null) {
				goTo(linked);
			}
		};
		window.addEventListener('hashchange', onHashChange);
		return (): void => window.removeEventListener('hashchange', onHashChange);
	}, [count, goTo]);

	useEffect((): (() => void) => {
		const onKeyDown = (event: KeyboardEvent): void => {
			const isTyping = event.target instanceof Element && event.target.closest('input, select, textarea');
			if (event.altKey || event.ctrlKey || event.metaKey || isTyping || isZoomOpen()) {
				return;
			}
			if (event.key === 'z') {
				openZoom(index);
				return;
			}
			if (mode === 'page' && (event.key === 'Home' || event.key === 'End')) {
				event.preventDefault();
				goTo(event.key === 'Home' ? 0 : count - 1);
				return;
			}
			const step = STEPS[event.key] ?? (mode === 'page' ? PAGE_MODE_STEPS[event.key] : undefined);
			if (!step) {
				return;
			}
			event.preventDefault();
			// shift+space pages back, and past either end there is nothing to step to
			const target = index + (event.key === ' ' && event.shiftKey ? -step : step);
			if (target >= 0 && target < count) {
				goTo(target, true);
			}
		};
		window.addEventListener('keydown', onKeyDown);
		return (): void => window.removeEventListener('keydown', onKeyDown);
	}, [count, goTo, index, isZoomOpen, mode, openZoom]);

	// reading down hides the site header and this toolbar, scrolling up or focusing them brings them back
	useEffect((): (() => void) | void => {
		if (mode !== 'scroll') {
			return;
		}
		const root = document.documentElement;
		let last = window.scrollY;
		const onScroll = (): void => {
			const delta = window.scrollY - last;
			if (Math.abs(delta) < CHROME_SLACK) {
				return;
			}
			root.dataset.chrome = delta > 0 && window.scrollY > window.innerHeight / 2 ? 'hidden' : 'shown';
			last = window.scrollY;
		};
		const onFocusIn = (event: FocusEvent): void => {
			if ((event.target as Element).closest('header, [data-reader-toolbar]')) {
				root.dataset.chrome = 'shown';
			}
		};
		window.addEventListener('scroll', onScroll, {passive: true});
		document.addEventListener('focusin', onFocusIn);
		return (): void => {
			window.removeEventListener('scroll', onScroll);
			document.removeEventListener('focusin', onFocusIn);
			root.removeAttribute('data-chrome');
		};
	}, [mode]);

	// warm the cache with the next page so turning feels instant
	useEffect((): void => {
		if (mode !== 'page' || index + 1 >= count) {
			return;
		}
		const preload = new Image();
		preload.sizes = PAGE_SIZES;
		preload.srcset = pageImage(comic, index + 1).srcSet;
	}, [comic, count, index, mode]);

	function changeMode(next: TMode): void {
		writeStorage(MODE_KEY, next);
		set_mode(next);
		set_scrollTarget({index, smooth: false});
	}

	return (
		// page mode fills the screen under the header, so the page and its buttons always fit
		<main className={mode === 'page' ? 'flex h-[calc(100dvh-6rem)] flex-col bg-black text-white md:h-[calc(100dvh-4rem)]' : 'min-h-screen bg-black text-white'}>
			<div
				data-reader-toolbar
				className={'sticky top-24 z-10 flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b-2 border-white bg-black px-4 py-2 transition-[top,transform] duration-300 motion-reduce:transition-none md:top-16 [html[data-chrome=hidden]_&]:top-0 [html[data-chrome=hidden]_&]:-translate-y-full'}>
				<Link href={'/comics/'} className={`hover:underline ${FOCUS}`}>{'‹ Comics'}</Link>
				<h1 className={'mr-auto text-base font-normal md:text-lg'}>
					{`Issue ${comic.number} · ${comic.title}`}
					<span className={'hidden opacity-70 md:inline'}>{` · ${comic.subtitle}`}</span>
				</h1>
				{resumeFrom !== null ? (
					<button
						type={'button'}
						onClick={(): void => goTo(resumeFrom)}
						className={CONTROL}>
						{`Resume page ${resumeFrom + 1}`}
					</button>
				) : null}
				<label className={'flex items-center gap-2'}>
					<span className={'sr-only'}>{'Page'}</span>
					<select
						value={index}
						onChange={(event): void => goTo(Number(event.target.value))}
						className={`border-2 border-white bg-black px-2 py-1 ${FOCUS}`}>
						{comic.pages.map((_page, i): ReactElement => (
							<option key={i} value={i}>{i + 1}</option>
						))}
					</select>
					<span>{`/ ${count}`}</span>
				</label>
				<div
					role={'group'}
					aria-label={'Reading mode'}
					className={'flex gap-1'}>
					{MODES.map(([value, label]): ReactElement => (
						<button
							key={value}
							type={'button'}
							aria-pressed={mode === value}
							onClick={(): void => changeMode(value)}
							className={CONTROL}>
							{label}
						</button>
					))}
				</div>
				<button
					type={'button'}
					onClick={(): void => openZoom(index)}
					className={CONTROL}>
					{'Zoom'}
				</button>
			</div>

			{mode === 'scroll' ? (
				<ol className={'mx-auto flex max-w-3xl flex-col gap-2 py-4'}>
					{comic.pages.map((_page, i): ReactElement => (
						<li
							key={i}
							id={`page-${i + 1}`}
							data-page={i}
							className={'scroll-mt-48 md:scroll-mt-32'}>
							<button
								type={'button'}
								onClick={(): void => openZoom(i)}
								aria-label={`Zoom into ${pageAlt(comic, i, count)}`}
								className={`block w-full cursor-zoom-in ${FOCUS}`}>
								<img
									{...pageImage(comic, i)}
									sizes={SCROLL_SIZES}
									alt={pageAlt(comic, i, count)}
									loading={i < 2 ? 'eager' : 'lazy'}
									decoding={'async'}
									className={'h-auto w-full bg-white/5'} />
							</button>
						</li>
					))}
				</ol>
			) : (
				<div className={'flex min-h-0 flex-1 flex-col items-center gap-4 p-4'}>
					<button
						type={'button'}
						onClick={(): void => openZoom(index)}
						aria-label={`Zoom into ${pageAlt(comic, index, count)}`}
						className={`flex min-h-0 flex-1 cursor-zoom-in items-center justify-center ${FOCUS}`}>
						<img
							key={index}
							{...pageImage(comic, index)}
							sizes={PAGE_SIZES}
							alt={pageAlt(comic, index, count)}
							className={'size-auto max-h-full max-w-full bg-white/5'} />
					</button>
					<div className={'flex shrink-0 gap-4'}>
						<button
							type={'button'}
							disabled={index === 0}
							onClick={(): void => goTo(index - 1)}
							className={CONTROL}>
							{'‹ Previous'}
						</button>
						{index < count - 1 ? (
							<button
								type={'button'}
								onClick={(): void => goTo(index + 1)}
								className={CONTROL}>
								{'Next ›'}
							</button>
						) : (
							<Link href={next ? `/comics/${next.id}/` : '/comics/'} className={CONTROL}>
								{next ? `Issue ${next.number} · ${next.title} ›` : 'All comics ›'}
							</Link>
						)}
					</div>
				</div>
			)}

			{mode === 'scroll' ? <EndOfIssue next={next} /> : null}
		</main>
	);
}
