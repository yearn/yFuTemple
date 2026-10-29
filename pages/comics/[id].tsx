import React from 'react';
import {NextSeo} from 'next-seo';

import ComicReader from '../../components/reader/ComicReader';
import {COMICS, summary} from '../../utils/comicsManifest';

import type {GetStaticPaths, GetStaticProps} from 'next';
import type {ReactElement} from 'react';
import type {TComic, TComicSummary} from '../../utils/comics';

type TReaderPage = {
	comic: TComic,
	next: TComicSummary | null
};

export default function ReaderPage({comic, next}: TReaderPage): ReactElement {
	return (
		<>
			<NextSeo
				title={`Issue ${comic.number}: ${comic.subtitle} · yFu Comics`}
				description={`Read yFu issue ${comic.number}, ${comic.subtitle}, the ${comic.title} episode of the yFu comic.`} />
			<ComicReader
				key={comic.id}
				comic={comic}
				next={next} />
		</>
	);
}

export const getStaticPaths: GetStaticPaths = async () => ({
	paths: COMICS.map(({id}): {params: {id: string}} => ({params: {id}})),
	fallback: false
});

export const getStaticProps: GetStaticProps<TReaderPage, {id: string}> = async ({params}) => {
	const index = COMICS.findIndex(({id}): boolean => id === params?.id);
	const next = COMICS.at(index + 1);
	return {props: {comic: COMICS[index], next: next ? summary(next) : null}};
};
