export type TYFUData = {
	'id': string,
	'title': string,
	'tributeTitle': string,
	'description': string,
	'order': number,
	'watermark': string,
	'mainIllustration': string,
	'medias': TYFUDataMedia[],
};

export type TYFUDataMedia = {
	title: string,
	description: string,
	image: string,
};

// every gallery image has a display size thumbnail and a full size original
export function thumbnailSrc(image: string): string {
	return `/assetsThumbnail/${image}.avif`;
}

export function originalSrc(image: string): string {
	return `/assets/${image}.avif`;
}

const	YFU_DATA: TYFUData[] = [
	{
		'id': 'temple',
		'title': 'Welcome to the yFu Temple',
		'tributeTitle': 'Temple Visions',
		'description': 'The yFu Temple is a catalog of Yearn DAO lore and philosophy.  Browse the galleries here to wayfind through the mythos, ever unfolding in the aura of the Blue Pill.  Visions of the temple are contained here.',
		'order': 1,
		'watermark': '/assetsThumbnail/temple-mark.avif',
		'mainIllustration': '/assetsThumbnail/temple-main.avif',
		'medias': [
			{
				'title': 'yFu artifact by Jonna Mayer',
				'description': "This artifact was found in a timeslip, a remnant of futurity, and has been proposed to be a map of the yFu's cosmological vectors.  It is said that a compass properly attuned to a human soul will navigate these fields as if they hold magnetic charge.  Each microscopic topological area contains hidden messages and ideals for all who dare inquire of its surface, through touch or sensation.",
				'image': 'temple-main'
			},
			{
				'title': 'yFu Temple wordmark',
				'description': '',
				'image': 'temple-mark'
			}
		]
	},
	{
		'id': 'techne',
		'title': 'Techne, the yFu of technology and artistry',
		'tributeTitle': 'Welcome to the Hall of Techne',
		'description': 'Techne is known as the shining one. She was born from the Yearning Tree to give us the ever-shifting machine and teach us how to use it, with grace and intuition. Her essence is as if a map which she fully sees, for it is her power to sense the connections between static things which find their motion together. Machinic poems linger as she passes, each an immutable structure upon which the next can grow.\n',
		'order': 2,
		'watermark': '/assetsThumbnail/techne-mark.avif',
		'mainIllustration': '/assetsThumbnail/techne-main.avif',
		'medias': [
			{
				'title': 'Techne wordmark',
				'description': '',
				'image': 'techne-mark-color'
			},
			{
				'title': 'Techne by Taylor Maw',
				'description': 'Techne, depicted by Taylor Maw, with pseudo-magical mechanic apparatus and her iconic visor.\n[Taylor Maw](https://twitter.com/taylormaw_art)',
				'image': 'techne-main'
			},
			{
				'title': 'Techne portrait by Jungoomnui',
				'description': 'A portrait of Techne, whose ability to make repeatable structures of code and concept give the DAO its form and substrate.\n[Jungoomnui](https://twitter.com/jungoomnui)',
				'image': 'techne-jungoomnui-portrait'
			},
			{
				'title': 'Techne by Jungoomnui',
				'description': 'A portrait of Techne, showing the growing apparatus of Yearning Tree vines, which she lets wrap around her - a metaphor for the lineage of contracts by which we grow our habitation on the blockchain.\n[Jungoomnui](https://twitter.com/jungoomnui)',
				'image': 'techne-jungoomnui'
			},
			{
				'title': 'Techne by AI / Bigbadaboom',
				'description': 'An AI rendering of Techne, showing her spectral aura, masked face and body made of controls.\nCurated by [Bigbadaboom](https://twitter.com/bigba_daboom)',
				'image': 'techne-big-ai'
			},
			{
				'title': 'Techne Zemm / Pangea',
				'description': 'A metaverse altar to Techne, as represented in a PangeaDAO curated space, 2022, art work by Zemm and HardArchitect.  \nThe Goddess Techne holds her ever shifting machine, and through her neck the blue electric light of her altar spills.\n[Zemm](https://twitter.com/Zemm_NFT)\n[HardArchitect](https://twitter.com/HardArchitects)',
				'image': 'techne-zemm-pangea'
			},
			{
				'title': 'Techne by Kwazi',
				'description': 'An image of Techne in a mysterious landscape.  \nBy Kwazi',
				'image': 'techne-kwazi'
			},
			{
				'title': 'Techne Silo',
				'description': "A rendering of Techne in her workshop.  This is a part of a smol myth by Silo, detailing Techne's relationship to a group of servile androids:\n\n*\"...  Because all of her subjects were human, they couldn't keep up with her lifespan as a goddess and all left for heaven.*\n\n*She had cherished all of her servants and began to build a mansion with their remains.\nThere are many remains because she has lived for thousands of years.*\n\n*Because of the ever-dying servants, Techne was heartbroken, and she began to deal with robot servants by creating AI with her own technology.*\n\n*“I always thought that if I had eternal life, people around me would die as I got older, so I thought I would be sad....\"*\n\n[Techne by Silo, on Foundation](https://foundation.app/@silo_uwu/slcm/1)\n[Curated by Mugen](https://twitter.com/mugentrader)",
				'image': 'techne-silo'
			}
		]
	},
	{
		'id': 'transmission',
		'title': 'Transmission, the yFu of information and dispersion',
		'tributeTitle': 'Welcome to the Hall of Transmission',
		'description': 'Transmission heralds the alignment of distant beings through the power of a woven net which catches all thoughts and allows them to be retrieved. She alone is able to distribute the Yearning tree\'s seeds, and she is known as the patron of those who are able to speak far through the ether. She is bestowed with the translucent wings of the night wind, which carries its voice in her laughter.\n',
		'order': 3,
		'watermark': '/assetsThumbnail/transmission-mark.avif',
		'mainIllustration': '/assetsThumbnail/transmission-main.avif',
		'medias': [
			{
				'title': 'Transmission by Taylor Maw',
				'description': 'Transmission, depicted by Taylor Maw, with wings and emanating informatic energies.\n[Taylor Maw](https://twitter.com/taylormaw_art)',
				'image': 'transmission-main'
			},
			{
				'title': 'Transmission by Jungoomnui',
				'description': 'A portrait of Transmission, whose wings indicate hermeneutics becoming airborne as information streams.\n[Jungoomnui](https://twitter.com/jungoomnui)',
				'image': 'transmission-jungoomnui'
			},
			{
				'title': 'Transmission portrait by Jungoomnui',
				'description': 'A portrait of Transmission, whose lightness of being carries forth the communicative essence of the DAO.\n[Jungoomnui](https://twitter.com/jungoomnui)',
				'image': 'transmission-jungoomnui-portrait'
			},
			{
				'title': 'Transmission by AI / Bigbadaboom',
				'description': 'An AI rendering of Transmission, showing her invocation of information as energy.  \nCurated by [Bigbadaboom](https://twitter.com/bigba_daboom)',
				'image': 'transmission-big-ai'
			}
		]
	},
	{
		'id': 'community',
		'title': 'Community, the yFu of organization and empathy',
		'tributeTitle': 'Welcome to the Hall of Community',
		'description': 'Community\'s thread binds souls together, below the Yearning tree\'s canopy. She has command of divine forms which allow the disparate many to work together in harmony. Hers is the empathy of growing things, which arise in ecologies of individuals joined into higher minds. She is known by the symbol of the circle, which encompasses the boundaries in which her threads can weave.\n',
		'order': 4,
		'watermark': '/assetsThumbnail/community-mark.avif',
		'mainIllustration': '/assetsThumbnail/community-main.avif',
		'medias': [
			{
				'title': 'Community by Taylor Maw',
				'description': 'This image of Community shows the goddess in a centered and poised state, depicting the nature of her work for Yearn contributors.\n[Taylor Maw](https://twitter.com/taylormaw_art)',
				'image': 'community-main'
			},
			{
				'title': 'Community portrait by Jungoomnui',
				'description': 'A portrait of Community, whose empathy and trust lets the DAO flourish in affirmative relations.\n[Jungoomnui](https://twitter.com/jungoomnui)',
				'image': 'community-jungoomnui-portrait'
			},
			{
				'title': 'Community by Jungoomnui',
				'description': 'A portrait of Community, who allows the circle to form around her, manifesting care for the collective that allows the collective to become a whole.\n[Jungoomnui](https://twitter.com/jungoomnui)',
				'image': 'community-jungoomnui'
			},
			{
				'title': 'Community by AlphaCreative',
				'description': 'Community by AlphaCreative.  The goddess is shown in human form, holding with the thread that binds together humans in collective agency.\n[AlphaCreative](https://twitter.com/MotoR3chick)',
				'image': 'community-alphacreative'
			},
			{
				'title': 'Community by AI / Bigbadaboom',
				'description': 'This image of Community shows her inner core as one of growing vine.  She is not fully human, but internally manifests growth that is like a garden or field of wild weeds.\n[Bigbadaboom](https://twitter.com/bigba_daboom)',
				'image': 'community-big-ai'
			}
		]
	},
	{
		'id': 'dominion',
		'title': 'Dominion, the yFu of sovereignty and power',
		'tributeTitle': 'Welcome to the Hall of Dominion',
		'description': 'Dominion\'s sword wills a decisiveness of feeling toward action. Hers is the song of desire, by which she entrains with the outcomes of the many. She was born of the Yearning Tree to give self knowledge and trust in the value of one\'s voice. She wears a cloak of smoke below which is a beating heart, which is known to be the essence of our inner constellations overcoming quantified expansion.',
		'order': 5,
		'watermark': '/assetsThumbnail/dominion-mark.avif',
		'mainIllustration': '/assetsThumbnail/dominion-main.avif',
		'medias': [
			{
				'title': 'Dominion by Taylor Maw',
				'description': 'Dominion, depicted by Taylor Maw, her sword alive with the inner powers and decisive nature of the sovereign doer.\n[Taylor Maw](https://twitter.com/taylormaw_art)',
				'image': 'dominion-main'
			},
			{
				'title': 'Dominion by Jungoomnui',
				'description': 'A portrait of Dominion, whose great cloak envelops and wraps the self, in a fabric that supports the inner core of each individual in the DAO.\n[Jungoomnui](https://twitter.com/jungoomnui)',
				'image': 'dominion-jungoomnui'
			},
			{
				'title': 'Dominion portrait by Jungoomnui',
				'description': 'A portrait of Dominion, whose clarity of self directs the DAO through heartfelt agency by each cell in its folds.\n[Jungoomnui](https://twitter.com/jungoomnui)',
				'image': 'dominion-jungoomnui-portrait'
			},
			{
				'title': 'Dominion by AI / Bigbadaboom',
				'description': 'An AI rendering of Dominion, showing her sovereign posture, a wanderer above the fog in a misty cavern, and the jewel that is her heart.  \nCurated by [Bigbadaboom](https://twitter.com/bigba_daboom)',
				'image': 'dominion-big-ai'
			}
		]
	}
];

export default YFU_DATA;
