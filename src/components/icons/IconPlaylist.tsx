import React from 'react';

// a track list with a note, for the button that opens the player and its playlist
function Icon({width = '16', height = '16', ...props}): React.ReactElement {
	return (
		<svg
			xmlns={'http://www.w3.org/2000/svg'}
			{...props}
			width={width}
			height={height}
			viewBox={'0 0 16 16'}
			fill={'currentcolor'}>
			<rect
				x={'0.5'}
				y={'2.5'}
				width={'9'}
				height={'1.5'} />
			<rect
				x={'0.5'}
				y={'6.5'}
				width={'9'}
				height={'1.5'} />
			<rect
				x={'0.5'}
				y={'10.5'}
				width={'7'}
				height={'1.5'} />
			<path d={'M12 2h3.5v2.5h-2v8a2.25 2.25 0 1 1-1.5-2.12z'} />
		</svg>
	);
}

export default Icon;
