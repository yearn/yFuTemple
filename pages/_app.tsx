import React from 'react';
import Head from 'next/head';
import {DefaultSeo} from 'next-seo';

import Header from '../components/Header';
import {AudioContextApp} from '../contexts/useAudio';

import type {AppProps} from 'next/app';
import type {ReactElement} from 'react';

import '../style.css';

function	AppMeta(): ReactElement {
	return (
		<>
			<Head>
				<title>{'yFu Temple'}</title>
				<meta httpEquiv={'X-UA-Compatible'} content={'IE=edge'} />
				<meta name={'viewport'} content={'width=device-width, initial-scale=1'} />
				<meta name={'description'} content={'YFU Temple'} />
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
				<meta name={'msapplication-TileColor'} content={'#ffffff'} />
				<meta name={'theme-color'} content={'#ffffff'} />

				{/* ROBOTS */}
				<meta name={'robots'} content={'index,follow'} />
				<meta name={'googlebot'} content={'index,follow'} />
			</Head>
			<DefaultSeo
				title={'yFu Temple'}
				defaultTitle={'YFU Temple'}
				description={'YFU Temple'}
				openGraph={{
					type: 'website',
					locale: 'en_US',
					url: process.env.WEBSITE_URI,
					site_name: 'YFU Temple',
					title: 'YFU Temple',
					description: 'YFU Temple',
					images: [
						{
							url: `${process.env.WEBSITE_URI}og.jpg`,
							width: 1200,
							height: 675,
							alt: 'Yearn'
						}
					]
				}}
				twitter={{
					handle: '@iearnfinance',
					site: '@iearnfinance',
					cardType: 'summary_large_image'
				}} />
		</>
	);
}

function	AppWrapper(props: AppProps): ReactElement {
	const	{Component, pageProps, router} = props;

	return (
		<>
			<AppMeta />
			<Header />
			<div className={'z-10 overflow-x-hidden pt-24 md:pt-16'}>
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
					className={'size-full object-cover'}>
					<source src={'/bglow.webm'} type={'video/webm'} />
				</video>
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
