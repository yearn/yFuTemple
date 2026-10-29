// Encodes the site's artwork as AVIF at the sizes it is shown at, from masters where we have them.
//
// usage: node scripts/encode-assets.mjs '<path to "keybase backup/yearnfinance">'
//
// Sources are a master under that folder, the original file as committed at LEGACY_COMMIT
// (most of the artwork already is its own master), or a frame of a committed video.
// Gallery images get a thumbnail in assetsThumbnail and a full size copy in assets, which the
// gallery opens as the original.
import {execFileSync} from 'child_process';
import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const LEGACY_COMMIT = '4d0b873';
const THUMBNAIL_WIDTH = 1000;
const THUMBNAIL_QUALITY = 60;
// big enough to inspect, the full masters stay in the archive
const ORIGINAL_WIDTH = 2560;
const ORIGINAL_QUALITY = 70;

const WORDMARKS = 'yfi-story/cron-yfu-story/art/Wordmarks';
const GALLERY = {
	'community-alphacreative': {legacy: 'assets/community-alphacreative.jpg'},
	'community-big-ai': {legacy: 'assets/community-big-ai.jpg'},
	'community-jungoomnui-portrait': {legacy: 'assets/community-jungoomnui-portrait.png'},
	'community-jungoomnui': {legacy: 'assets/community-jungoomnui.png'},
	'community-main': {legacy: 'assets/community-main.png'},
	'dominion-big-ai': {legacy: 'assets/dominion-big-ai.jpg'},
	'dominion-jungoomnui-portrait': {legacy: 'assets/dominion-jungoomnui-portrait.png'},
	'dominion-jungoomnui': {legacy: 'assets/dominion-jungoomnui.png'},
	'dominion-main': {legacy: 'assets/dominion-main.png'},
	'techne-big-ai': {legacy: 'assets/techne-big-ai.jpg'},
	'techne-jungoomnui-portrait': {legacy: 'assets/techne-jungoomnui-portrait.png'},
	'techne-jungoomnui': {legacy: 'assets/techne-jungoomnui.png'},
	'techne-kwazi': {legacy: 'assets/techne-kwazi.jpg'},
	'techne-main': {legacy: 'assets/techne-main.png'},
	'techne-mark-color': {master: `${WORDMARKS}/2021-12-22_yearn_assets_techne.png`},
	'techne-silo': {legacy: 'assets/techne-silo.jpg'},
	'techne-zemm-pangea': {legacy: 'assets/techne-zemm-pangea.jpg'},
	// the committed jpeg was a lossy export of this poster
	'temple-main': {master: 'yfi-story/cron-yfu-story/art/2021-12-07_yearn_poster_01.png'},
	'temple-mark': {legacy: 'assets/temple-mark.png'},
	'transmission-big-ai': {legacy: 'assets/transmission-big-ai.jpg'},
	'transmission-jungoomnui-portrait': {legacy: 'assets/transmission-jungoomnui-portrait.png'},
	'transmission-jungoomnui': {legacy: 'assets/transmission-jungoomnui.png'},
	'transmission-main': {legacy: 'assets/transmission-main.png'}
};

// everything else, as [output, source, max width]
const SINGLES = [
	// white versions of the wordmarks, only these sizes exist
	['assetsThumbnail/community-mark.avif', {legacy: 'assetsThumbnail/community-mark.png'}, THUMBNAIL_WIDTH],
	['assetsThumbnail/dominion-mark.avif', {legacy: 'assetsThumbnail/dominion-mark.png'}, THUMBNAIL_WIDTH],
	['assetsThumbnail/techne-mark.avif', {legacy: 'assetsThumbnail/techne-mark.png'}, THUMBNAIL_WIDTH],
	['assetsThumbnail/transmission-mark.avif', {legacy: 'assetsThumbnail/transmission-mark.png'}, THUMBNAIL_WIDTH],
	['assetsThumbnail/comic1-mark.avif', {legacy: 'assetsThumbnail/comic1-mark.png'}, THUMBNAIL_WIDTH],
	['assets/comic1-main.avif', {legacy: 'assets/comic1-main.jpg'}, null],
	['audio-marks/community.avif', {master: `${WORDMARKS}/2021-12-22_yearn_assets_community.png`}, 760],
	['audio-marks/dominion.avif', {master: `${WORDMARKS}/2021-12-22_yearn_assets_dominion.png`}, 760],
	['audio-marks/techne.avif', {master: `${WORDMARKS}/2021-12-22_yearn_assets_techne.png`}, 760],
	['audio-marks/transmission.avif', {master: `${WORDMARKS}/2021-12-26_yearn_assets_transmission.png`}, 760],
	['audio-marks/yfiTree.avif', {legacy: 'audio-marks/yfiTree.png'}, null],
	['yfiTree.avif', {legacy: 'yfiTree.png'}, 300],
	['yfiTree2.avif', {legacy: 'yfiTree2.png'}, 224],
	['yearningTree.avif', {legacy: 'yearningTree.jpg'}, null],
	// poster for the background video, so nothing jumps when it starts
	['bg.avif', {video: 'bglow.webm'}, null]
];

function load(source, mastersRoot) {
	if (source.master) {
		return fs.readFileSync(path.join(mastersRoot, source.master));
	}
	if (source.legacy) {
		return execFileSync('git', ['show', `${LEGACY_COMMIT}:public/${source.legacy}`], {maxBuffer: 256 * 1024 * 1024});
	}
	return execFileSync('ffmpeg', ['-v', 'error', '-i', path.join('public', source.video), '-frames:v', '1', '-f', 'image2pipe', '-c:v', 'png', '-'], {maxBuffer: 256 * 1024 * 1024});
}

async function encode(input, output, maxWidth, quality) {
	const {width} = await sharp(input).metadata();
	fs.mkdirSync(path.dirname(path.join('public', output)), {recursive: true});
	await sharp(input)
		.resize(maxWidth && maxWidth < width ? maxWidth : width)
		.avif({quality, effort: 6})
		.toFile(path.join('public', output));
	const kb = (fs.statSync(path.join('public', output)).size / 1024).toFixed(0);
	console.log(`${output} ${kb}K`);
}

const [mastersRoot] = process.argv.slice(2);
if (!mastersRoot) {
	console.error('usage: node scripts/encode-assets.mjs <path to "keybase backup/yearnfinance">');
	process.exit(1);
}

for (const [name, source] of Object.entries(GALLERY)) {
	const input = load(source, mastersRoot);
	await encode(input, `assetsThumbnail/${name}.avif`, THUMBNAIL_WIDTH, THUMBNAIL_QUALITY);
	await encode(input, `assets/${name}.avif`, ORIGINAL_WIDTH, ORIGINAL_QUALITY);
}
for (const [output, source, maxWidth] of SINGLES) {
	await encode(load(source, mastersRoot), output, maxWidth, THUMBNAIL_QUALITY);
}
