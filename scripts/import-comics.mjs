// Renders the yFu comic print PDFs into AVIF page sets in public/comics and writes content/comics.json.
//
// usage: node scripts/import-comics.mjs '<path to "pills comic final">'
//
// The 2024-04-17 PDFs are the latest edition, but they have a few bugs that the
// site's 1200px export (commit LEGACY_COMMIT) had already fixed, so some pages
// come from elsewhere. Needs poppler's pdftoppm on PATH.
import {execFileSync} from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import sharp from 'sharp';

const LEGACY_COMMIT = '4d0b873';
const LEGACY_DIR = 'public/assets/comics/img';
const DPI = 300;
const WIDTHS = [600, 1200];
const QUALITY = 60;

const ISSUES = [
	{
		id: 'techne',
		number: 1,
		title: 'Techne',
		subtitle: 'Andre the Patcher',
		pdf: '2024-04-17 fix bigbadabook/yFu_01 Full 04172024.pdf',
		fixes: {
			// the pdf leaves white strips down both edges of this page
			3: {legacy: 'techne/03-yfu-01-full-04172024.jpg'}
		}
	},
	{
		id: 'transmission',
		number: 2,
		title: 'Transmission',
		subtitle: 'Transmission Received',
		pdf: '2024-04-17 fix bigbadabook/yFu_02 Full 04172024.pdf',
		fixes: {
			// the 2024 pdf carries issue 3's cover
			1: {pdf: 'PILLS_02 Full 09182023 R.pdf', page: 1},
			// and issue 3's credits page, so only the title band comes from 2023, keeping the 2024 credits and footer
			2: {pdf: 'PILLS_02 Full 09182023 R.pdf', page: 2, band: [135, 190]},
			// the site replaced this behind-the-scenes page and no pdf has the replacement
			27: {legacy: 'transmission/27-yfu-02-full-04172024.jpg'}
		}
	},
	{
		id: 'community',
		number: 3,
		title: 'Community',
		subtitle: 'Community\'s Circle',
		pdf: '2024-04-17 fix bigbadabook/yFu_03 Full 04172024.pdf',
		fixes: {}
	},
	{
		id: 'dominion',
		number: 4,
		title: 'Dominion',
		subtitle: 'Attack on Markap',
		pdf: '2024-04-17 fix bigbadabook/yFu_04 Full 04172024.pdf',
		fixes: {}
	}
];

function pageCount(pdf) {
	const info = execFileSync('pdfinfo', [pdf], {encoding: 'utf8'});
	return Number(info.match(/^Pages:\s+(\d+)/m)[1]);
}

function renderPage(pdf, page, tmp) {
	const prefix = path.join(tmp, 'render');
	execFileSync('pdftoppm', ['-r', String(DPI), '-png', '-f', String(page), '-l', String(page), '-singlefile', pdf, prefix]);
	return fs.readFileSync(`${prefix}.png`);
}

// copies a full-width band, given in pdf points from the top, from one render of a page onto another
async function pasteBand(base, donor, [top, bottom]) {
	const scale = DPI / 72;
	const {width} = await sharp(base).metadata();
	const y = Math.round(top * scale);
	const band = await sharp(donor).extract({left: 0, top: y, width, height: Math.round((bottom - top) * scale)}).toBuffer();
	return sharp(base).composite([{input: band, left: 0, top: y}]).png().toBuffer();
}

function legacyPage(file) {
	return execFileSync('git', ['show', `${LEGACY_COMMIT}:${LEGACY_DIR}/${file}`], {maxBuffer: 64 * 1024 * 1024});
}

async function encode(input, outDir, number) {
	const {width, height} = await sharp(input).metadata();
	const widths = [...WIDTHS.filter((w) => w < width), width];
	await Promise.all(widths.map((w) => sharp(input)
		.resize(w)
		.avif({quality: QUALITY, effort: 4})
		.toFile(path.join(outDir, `${String(number).padStart(2, '0')}-${w}.avif`))));
	return {width, height, widths};
}

const [sourceRoot] = process.argv.slice(2);
if (!sourceRoot) {
	console.error('usage: node scripts/import-comics.mjs <path to "pills comic final">');
	process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'comics-'));
const manifest = [];
for (const issue of ISSUES) {
	const outDir = path.join('public', 'comics', issue.id);
	fs.rmSync(outDir, {recursive: true, force: true});
	fs.mkdirSync(outDir, {recursive: true});
	const pdf = path.join(sourceRoot, issue.pdf);
	const pages = [];
	for (let number = 1; number <= pageCount(pdf); number++) {
		const fix = issue.fixes[number];
		let input;
		let source;
		if (fix?.legacy) {
			input = legacyPage(fix.legacy);
			source = `${LEGACY_DIR}/${fix.legacy}@${LEGACY_COMMIT}`;
		} else if (fix?.band) {
			input = await pasteBand(renderPage(pdf, number, tmp), renderPage(path.join(sourceRoot, fix.pdf), fix.page, tmp), fix.band);
			source = `${issue.pdf} p${number}, ${fix.band.join('-')}pt from ${fix.pdf} p${fix.page}`;
		} else if (fix?.pdf) {
			input = renderPage(path.join(sourceRoot, fix.pdf), fix.page, tmp);
			source = `${fix.pdf} p${fix.page}`;
		} else {
			input = renderPage(pdf, number, tmp);
			source = `${issue.pdf} p${number}`;
		}
		pages.push({...await encode(input, outDir, number), source});
		console.log(`${issue.id} ${number} <- ${source}`);
	}
	manifest.push({id: issue.id, number: issue.number, title: issue.title, subtitle: issue.subtitle, pages});
}
fs.rmSync(tmp, {recursive: true, force: true});
fs.mkdirSync('content', {recursive: true});
fs.writeFileSync(path.join('content', 'comics.json'), `${JSON.stringify(manifest, null, '\t')}\n`);
