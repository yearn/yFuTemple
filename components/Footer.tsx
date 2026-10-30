import	React from	'react';
import	Link from	'next/link';

import type {ReactElement} from 'react';

// a nod to 2000s hit counters, it doesn't count anything
const	VISITORS = '001337';

const	PAGES = [
	['HOME', '/'],
	['COMICS', '/comics/'],
	['FAQ', '/faq/']
];

const	LINKS = [
	['TWITTER', 'https://x.com/yearnfi'],
	['DISCORD', 'https://discord.com/invite/yearn'],
	['BLOG', 'https://blog.yearn.fi'],
	['TELEGRAM', 'https://t.me/yearnfinance'],
	['THE BLUE PILL', 'https://yfistory.org']
];

function	Footer(): ReactElement {
	return (
		<footer className={'z-20 mt-12 flex flex-col items-center border-t-2 border-white pb-5 md:mt-20 md:pb-12'}>
			<div className={'my-8 md:my-12'}>
				<div className={'flex flex-row items-center justify-center space-x-1'}>
					{VISITORS.split('').map((digit, index): ReactElement => (
						<div key={index} className={'flex h-12 w-9 items-center justify-center border-2 border-white bg-black font-chicago tabular-nums text-white'}>
							{digit}
						</div>
					))}
				</div>
			</div>
			<nav aria-label={'Site'} className={'mb-6 flex w-full flex-row items-center justify-center gap-8 font-monument text-lg text-white md:mb-8 md:text-xl'}>
				{PAGES.map(([label, href]): ReactElement => (
					<Link
						key={label}
						href={href}
						className={'hover:underline'}>
						{label}
					</Link>
				))}
			</nav>
			<nav aria-label={'Elsewhere'} className={'flex w-full flex-col items-center justify-center space-x-0 space-y-5 font-monument text-lg text-yblue md:flex-row md:space-x-8 md:space-y-0 md:text-xl'}>
				{LINKS.map(([label, href]): ReactElement => (
					<p key={label} className={'text-shadow transition-all duration-150'}>
						<a
							href={href}
							target={'_blank'}
							rel={'noreferrer'}>
							{label}
						</a>
					</p>
				))}
			</nav>
		</footer>
	);
}

export default Footer;
