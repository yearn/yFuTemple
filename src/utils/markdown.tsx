
import type {ComponentChildren, VNode} from 'preact';

// the small markdown subset the gallery texts use: [links](https://…), **bold**, *italic*, ~~accent~~,
// blank lines between paragraphs and single newlines as line breaks. builds preact nodes, never html.
const INLINE = /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*|~~([^~]+)~~/g;

function inline(text: string, line: number): ComponentChildren[] {
	const nodes: ComponentChildren[] = [];
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

export function Markdown({text, className}: {text: string, className?: string}): VNode {
	return (
		<div className={className}>
			{text.trim().split(/\n{2,}/).map((paragraph, i): VNode => (
				<p key={i}>
					{paragraph.split('\n').flatMap((line, j): ComponentChildren[] => (j === 0 ? inline(line, j) : [<br key={`br-${j}`} />, ...inline(line, j)]))}
				</p>
			))}
		</div>
	);
}
