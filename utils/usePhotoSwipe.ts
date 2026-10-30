import {useCallback, useEffect, useRef} from 'react';

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
	const lightbox = useRef<PhotoSwipeLightbox | null>(null);
	const callbacks = useRef({onChange, onClose});
	callbacks.current = {onChange, onClose};

	useEffect((): (() => void) => {
		let instance: PhotoSwipeLightbox | null = null;
		let isCancelled = false;
		void import('photoswipe/lightbox').then(({default: Lightbox}): void => {
			if (isCancelled) {
				return;
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
					callbacks.current.onChange?.(instance.pswp.currIndex);
				}
			});
			instance.on('close', (): void => {
				if (instance?.pswp) {
					callbacks.current.onClose?.(instance.pswp.currIndex);
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
			lightbox.current = instance;
		});
		return (): void => {
			isCancelled = true;
			instance?.destroy();
			lightbox.current = null;
		};
	}, [hasCaption, items]);

	const open = useCallback((index: number, ordered?: SlideData[]): void => {
		lightbox.current?.loadAndOpen(index, ordered);
	}, []);
	const isOpen = useCallback((): boolean => Boolean(lightbox.current?.pswp), []);

	return {open, isOpen};
}
