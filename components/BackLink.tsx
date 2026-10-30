import React from 'react';
import Link from 'next/link';

import type {ReactElement} from 'react';

type TBackLink = {
	href: string,
	label: string
};

// the way up from a page, named after where it leads
export default function BackLink({href, label}: TBackLink): ReactElement {
	return (
		<Link
			href={href}
			className={'font-scope text-xl text-white hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white md:text-2xl'}>
			{`‹ ${label}`}
		</Link>
	);
}
