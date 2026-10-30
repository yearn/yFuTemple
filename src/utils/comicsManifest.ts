// only import from page frontmatter, so the manifest stays out of client bundles
import comics from '../../content/comics.json';

import type {TComic, TComicSummary} from './comics';

export const COMICS: TComic[] = comics;

export function summary({id, number, title, subtitle}: TComic): TComicSummary {
	return {id, number, title, subtitle};
}
