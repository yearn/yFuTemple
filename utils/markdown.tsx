import React from 'react';

import type {ReactElement, ReactNode} from 'react';

// the small markdown subset the gallery texts use: [links](https://…), **bold**, *italic*, ~~accent~~,
// blank lines between paragraphs and single newlines as line breaks. builds react nodes, never html.
const INLINE = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|~~([^~]+)~~/g;

function inline(text: string, line: number): ReactNode[] {
	const nodes: ReactNode[] = [];
	let last = 0;
	for (const match of text.matchAll(INLINE)) {
		const [whole, label, href, bold, italic, accent] = match;
		const key = `${line}-${match.index}`;
		nodes.push(text.slice(last, match.index));
		if (href) {
			nodes.push(
				<a
					key={key}
					href={href}
					target={'_blank'}
					rel={'noreferrer'}
					className={'font-bold text-yblue underline'}>
					{label}
				</a>
			);
		} else if (bold) {
			nodes.push(<strong key={key}>{bold}</strong>);
		} else if (italic) {
			nodes.push(<em key={key}>{italic}</em>);
		} else {
			nodes.push(<span key={key} className={'text-yblue'}>{accent}</span>);
		}
		last = match.index + whole.length;
	}
	nodes.push(text.slice(last));
	return nodes;
}

export function Markdown({text, className}: {text: string, className?: string}): ReactElement {
	return (
		<div className={className}>
			{text.trim().split(/\n{2,}/).map((paragraph, i): ReactElement => (
				<p key={i}>
					{paragraph.split('\n').flatMap((line, j): ReactNode[] => (j === 0 ? inline(line, j) : [<br key={`br-${j}`} />, ...inline(line, j)]))}
				</p>
			))}
		</div>
	);
}
