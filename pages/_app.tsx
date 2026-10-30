import React from 'react';
import Head from 'next/head';
import {DefaultSeo} from 'next-seo';

import Header from '../components/Header';
import {AudioContextApp} from '../contexts/useAudio';

import type {AppProps} from 'next/app';
import type {ReactElement} from 'react';

import '../style.css';

const	DESCRIPTION = 'Read the four yFu comics, walk the halls of the yFu goddesses and listen to their soundtrack. An archive of Yearn lore.';

function	AppMeta({path}: {path: string}): ReactElement {
	return (
		<>
			<Head>
				<meta httpEquiv={'X-UA-Compatible'} content={'IE=edge'} />
				<meta name={'viewport'} content={'width=device-width, initial-scale=1'} />
				<meta charSet={'utf-8'} />

				{/* FAVICONS */}
				<link
					rel={'apple-touch-icon'}
					sizes={'180x180'}
					href={'/favicons/apple-touch-icon.png'} />
				<link
					rel={'icon'}
					type={'image/png'}
					sizes={'192x192'}
					href={'/favicons/android-chrome-192x192.png'} />
				<link
					rel={'icon'}
					type={'image/png'}
					sizes={'512x512'}
					href={'/favicons/android-chrome-512x512.png'} />
				<link
					rel={'icon'}
					type={'image/png'}
					sizes={'32x32'}
					href={'/favicons/favicon-32x32.png'} />
				<link
					rel={'icon'}
					type={'image/png'}
					sizes={'16x16'}
					href={'/favicons/favicon-16x16.png'} />
				<link rel={'manifest'} href={'/favicons/site.webmanifest'} />
				<meta name={'msapplication-TileColor'} content={'#000000'} />
				<meta name={'theme-color'} content={'#000000'} />
			</Head>
			<DefaultSeo
				title={'yFu Temple'}
				description={DESCRIPTION}
				canonical={new URL(path, process.env.WEBSITE_URI).href}
				openGraph={{
					type: 'website',
					locale: 'en_US',
					url: new URL(path, process.env.WEBSITE_URI).href,
					siteName: 'yFu Temple',
					title: 'yFu Temple',
					description: DESCRIPTION,
					images: [
						{
							url: new URL('og.jpg', process.env.WEBSITE_URI).href,
							width: 2000,
							height: 1000,
							alt: 'The Yearning Tree'
						}
					]
				}}
				twitter={{
					handle: '@yearnfi',
					site: '@yearnfi',
					cardType: 'summary_large_image'
				}} />
		</>
	);
}

function	AppWrapper(props: AppProps): ReactElement {
	const	{Component, pageProps, router} = props;

	return (
		<>
			<AppMeta path={router.asPath.split('#')[0]} />
			<Header />
			<div className={'z-10 overflow-x-clip pt-24 md:pt-16'}>
				<Component
					key={router.route}
					router={props.router}
					{...pageProps} />
			</div>
			<div className={'fixed inset-0 -z-10'}>
				<video
					playsInline
					autoPlay
					muted
					loop
					poster={'/bg.avif'}
					className={'size-full object-cover motion-reduce:hidden'}>
					<source src={'/bglow.webm'} type={'video/webm'} />
				</video>
				{/* the poster on its own for visitors who asked for less motion */}
				<div className={'hidden size-full bg-[url(/bg.avif)] bg-cover bg-center motion-reduce:block'} />
			</div>
		</>
	);
}

function	MyApp(props: AppProps): ReactElement {
	const	{Component, pageProps} = props;

	return (
		<AudioContextApp>
			<AppWrapper
				Component={Component}
				pageProps={pageProps}
				router={props.router} />
		</AudioContextApp>
	);
}

export default MyApp;
