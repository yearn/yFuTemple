import comics from '../content/comics.json';

export type TComicPage = {
	width: number,
	height: number,
	widths: number[],
	source: string
};

export type TComic = {
	id: string,
	title: string,
	pages: TComicPage[]
};

export const COMICS: TComic[] = comics;

// widest variant a browser without srcset support should get
const FALLBACK_WIDTH = 1200;

export function pageImage(comic: TComic, index: number): {src: string, srcSet: string, width: number, height: number} {
	const page = comic.pages[index];
	const base = `/comics/${comic.id}/${String(index + 1).padStart(2, '0')}`;
	const fallback = page.widths.filter((width): boolean => width <= FALLBACK_WIDTH).at(-1);
	return {
		src: `${base}-${fallback}.avif`,
		srcSet: page.widths.map((width): string => `${base}-${width}.avif ${width}w`).join(', '),
		width: page.width,
		height: page.height
	};
}
