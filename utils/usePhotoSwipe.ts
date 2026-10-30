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

// zoom, pan and swipe between images; photoswipe itself loads on first use. items must be memoized.
export function usePhotoSwipe(items: SlideData[], {onChange, onClose, hasCaption = false}: TPhotoSwipeOptions = {}): {open: (index: number) => void, isOpen: () => boolean} {
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
				secondaryZoomLevel: 1,
				maxZoomLevel: 2
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

	const open = useCallback((index: number): void => {
		lightbox.current?.loadAndOpen(index);
	}, []);
	const isOpen = useCallback((): boolean => Boolean(lightbox.current?.pswp), []);

	return {open, isOpen};
}
