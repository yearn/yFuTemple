import {useCallback, useEffect, useEffectEvent, useRef} from 'react';

import type {SlideData} from 'photoswipe';
import type PhotoSwipeLightbox from 'photoswipe/lightbox';

import 'photoswipe/style.css';

type TPhotoSwipeOptions = {
	onChange?: (index: number) => void,
	onClose?: (index: number) => void,
	// show each slide's alt text under it
	hasCaption?: boolean
};

// the reader's page keys work in the viewer too
const VIEWER_KEYS: {[key: string]: 'next' | 'prev' | 'close'} = {j: 'next', k: 'prev', z: 'close'};
// a click zooms to this many times the fitted size, but never past the image's own pixels
const CLICK_ZOOM = 2.5;

// zoom, pan and swipe between images; photoswipe itself loads on first use. items must be memoized.
// open can take the items in another order, for when the page shows them differently.
export function usePhotoSwipe(items: SlideData[], {onChange, onClose, hasCaption = false}: TPhotoSwipeOptions = {}): {open: (index: number, ordered?: SlideData[]) => void, isOpen: () => boolean} {
	const viewer = useRef<PhotoSwipeLightbox | null>(null);
	// resolves once the viewer is set up, so a click made while it loads still opens it
	const ready = useRef<Promise<PhotoSwipeLightbox | null> | null>(null);
	// the viewer outlives renders, so it reports through these to the latest callbacks
	const changed = useEffectEvent((index: number): void => onChange?.(index));
	const closed = useEffectEvent((index: number): void => onClose?.(index));

	useEffect((): (() => void) => {
		let instance: PhotoSwipeLightbox | null = null;
		let isCancelled = false;
		ready.current = import('photoswipe/lightbox').then(({default: Lightbox}): PhotoSwipeLightbox | null => {
			if (isCancelled) {
				return null;
			}
			instance = new Lightbox({
				dataSource: items,
				pswpModule: async () => import('photoswipe'),
				bgOpacity: 0.95,
				loop: false,
				wheelToZoom: true,
				secondaryZoomLevel: (zoom): number => Math.min(1, zoom.fit * CLICK_ZOOM),
				maxZoomLevel: (zoom): number => Math.max(1, zoom.fit)
			});
			instance.on('afterInit', (): void => {
				instance?.pswp?.element?.setAttribute('aria-label', 'Image viewer');
			});
			instance.on('keydown', (event): void => {
				const action = VIEWER_KEYS[event.originalEvent.key];
				if (action && instance?.pswp) {
					event.preventDefault();
					instance.pswp[action]();
				}
			});
			// a slide can name a backdrop for artwork with transparency
			instance.on('contentAppend', ({content}): void => {
				if (content.element && content.data.background) {
					content.element.style.background = content.data.background;
				}
			});
			instance.on('change', (): void => {
				if (instance?.pswp) {
					changed(instance.pswp.currIndex);
				}
			});
			instance.on('close', (): void => {
				if (instance?.pswp) {
					closed(instance.pswp.currIndex);
				}
			});
			if (hasCaption) {
				instance.on('uiRegister', (): void => {
					instance?.pswp?.ui?.registerElement({
						name: 'caption',
						order: 9,
						isButton: false,
						appendTo: 'root',
						onInit: (element, pswp): void => {
							pswp.on('change', (): void => {
								element.textContent = pswp.currSlide?.data.alt ?? '';
							});
						}
					});
				});
			}
			instance.init();
			viewer.current = instance;
			return instance;
		});
		return (): void => {
			isCancelled = true;
			instance?.destroy();
			viewer.current = null;
			ready.current = null;
		};
	}, [hasCaption, items]);

	const open = useCallback((index: number, ordered?: SlideData[]): void => {
		const slides = ordered ?? items;
		// if the viewer can't load, say after a deploy replaced its files, show the image itself
		void ready.current?.then(
			(instance): void => void instance?.loadAndOpen(index, ordered),
			(): void => window.location.assign(slides[index].src ?? '')
		);
	}, [items]);
	const isOpen = useCallback((): boolean => Boolean(viewer.current?.pswp), []);

	return {open, isOpen};
}
