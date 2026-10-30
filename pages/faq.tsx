import React from 'react';
import {NextSeo} from 'next-seo';
import BackLink from 'components/BackLink';
import Footer from 'components/Footer';

import type {ReactElement} from 'react';

function FAQ(): ReactElement {
	return (
		<div className={'relative mb-10 flex flex-col border-2 border-white text-white'}>
			<div className={'border-b-2 border-white p-8'}>
				<h1 className={'whitespace-pre-wrap text-4xl font-bold text-white'}>
					{'F.A.Q.'}
				</h1>
				<div className={'mt-10'}>
					<h2 className={'text-2xl font-bold text-white'}>
						{'What is yFu the comic?'}
					</h2>
					<ul className={'mt-4 max-w-2xl list-outside list-disc space-y-2 pl-4'}>
						<li className={'text-base text-white'}>
							{'yFu is a comic series in four books, each 24 pages, which tells the story of Yearn Finance\'s origination, DAO and philosophy, with an epic narrative set within the Pills universe.'}
						</li>
						<li className={'text-base text-white'}>
							{'The project and lore was conceived by the YFI Story team at Yearn (Zemm, Pillhead, BigBadaboom, Pentacle and Banteg).'}
						</li>
						<li className={'text-base text-white'}>
							{'yFu was written and produced by Devil\'s Due Studios: Story by Josh Blaylock, Art by Travis Hymel, Colors by Greg & Fake, Letters by Shawn DePasquale.'}
						</li>
						<li className={'text-base text-white'}>
							{'Additional development, design and technical support was provided by Major, Worms, Murderteeth, Pacific Design and yAcademy.'}
						</li>
					</ul>
				</div>

				<div className={'mt-10'}>
					<h2 className={'text-2xl font-bold text-white'}>
						{'What was the yFu Comic NFT?'}
					</h2>
					<ul className={'mt-4 max-w-2xl list-outside list-disc space-y-2 pl-4'}>
						<li className={'text-base text-white'}>
							{'In 2024, a limited edition of 888 yFu Comic NFTs was minted on Base, each associated with a frame from the comics.'}
						</li>
						<li className={'text-base text-white'}>
							{'Holders at the snapshot received a physical set of all four first edition comics, produced and shipped by Devil\'s Due Comics.'}
						</li>
						<li className={'text-base text-white'}>
							{'The NFT contract is '}
							<a
								href={'https://basescan.org/address/0x39adafad9fde221725b975b4adae8b8f2dfa6d4b'}
								target={'_blank'}
								rel={'noreferrer'}>
								<span className={'underline hover:text-yearn-blue'}>{'0x39ad...6d4b'}</span>
							</a>
						</li>
					</ul>
				</div>

				<div className={'mt-10'}>
					<h2 className={'text-2xl font-bold text-white'}>
						{'How is the yFu Temple affiliated with Yearn?'}
					</h2>
					<ul className={'mt-4 max-w-2xl list-outside list-disc space-y-2 pl-4'}>
						<li className={'text-base text-white'}>
							{'The yFu Temple was created in the process of developing the lore and characters in the yFu comic.'}
						</li>
						<li className={'text-base text-white'}>
							{'It is managed by Yearn contributors currently. You can get involved by finding us in the'}
							<a
								href={'https://discord.com/invite/yearn'}
								target={'_blank'}
								rel={'noreferrer'}>
								<span className={'underline hover:text-yearn-blue'}> {'Yearn Discord'}</span>
							</a>
						</li>
					</ul>
				</div>
			</div>

		</div>
	);
}


function Wrapper(): ReactElement {
	return (
		<div className={'relative -mt-1 flex w-screen flex-col overflow-hidden p-0 md:p-6'}>
			<NextSeo
				title={'FAQ · yFu Temple'}
				description={'Credits for the yFu comic, the 2024 comic NFT, and how the yFu Temple relates to Yearn.'} />
			<div className={'relative mx-auto w-full max-w-screen-xl'} style={{minHeight: '100vh'}}>
				<div>
					<div className={'p-4 md:px-0'}>
						<BackLink href={'/'} label={'HOME'} />
					</div>
					<section className={'w-full px-4 md:px-0'}>
						<FAQ/>
					</section>
				</div>
			</div>
			<Footer/>
		</div>
	);
}

export default Wrapper;
