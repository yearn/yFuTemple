export type TComicPage = {
	width: number,
	height: number,
	widths: number[],
	source: string
};

export type TComic = {
	id: string,
	number: number,
	title: string,
	subtitle: string,
	pages: TComicPage[]
};

export type TComicSummary = Omit<TComic, 'pages'>;

// widest variant a browser without srcset support should get
const FALLBACK_WIDTH = 1200;

function pageBase(comic: TComicSummary, index: number): string {
	return `/comics/${comic.id}/${String(index + 1).padStart(2, '0')}`;
}

export function pageImage(comic: TComic, index: number): {src: string, srcSet: string, width: number, height: number} {
	const page = comic.pages[index];
	const base = pageBase(comic, index);
	const fallback = page.widths.filter((width): boolean => width <= FALLBACK_WIDTH).at(-1);
	return {
		src: `${base}-${fallback}.avif`,
		srcSet: page.widths.map((width): string => `${base}-${width}.avif ${width}w`).join(', '),
		width: page.width,
		height: page.height
	};
}

export function fullPageSrc(comic: TComic, index: number): string {
	return `${pageBase(comic, index)}-${comic.pages[index].widths.at(-1)}.avif`;
}

// where the reader remembers the page an issue was left on
export function progressKey(id: string): string {
	return `reader-page-${id}`;
}

export function pageAlt(comic: TComicSummary, index: number, count: number): string {
	return `${comic.title}, page ${index + 1} of ${count}`;
}
