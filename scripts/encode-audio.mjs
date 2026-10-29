// Encodes the AAC fallback of each soundtrack from its WAV master, for browsers without Ogg Opus.
// The .opus files next to them were encoded from the same masters in 2022.
//
// usage: node scripts/encode-audio.mjs '<path to the "yfu temple" masters folder>'
//
// Needs an ffmpeg with AudioToolbox (aac_at), which macOS builds have. Float input keeps the
// 24-bit masters intact on the way into the encoder.
import {execFileSync} from 'child_process';
import path from 'path';

const MASTERS = {
	'techne': 'techne_v2.wav',
	'yearning_tree': 'yearning tree_final.wav',
	'dominion': 'dominion.v1.wav',
	'community': 'community_v2.wav',
	'transmission': 'transmission_v4.1.wav'
};

const [mastersRoot] = process.argv.slice(2);
if (!mastersRoot) {
	console.error('usage: node scripts/encode-audio.mjs <path to the "yfu temple" masters folder>');
	process.exit(1);
}

for (const [slug, master] of Object.entries(MASTERS)) {
	const output = path.join('public', 'audio', `${slug}.m4a`);
	execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', path.join(mastersRoot, master), '-af', 'aformat=sample_fmts=flt', '-c:a', 'aac_at', '-b:a', '128k', '-movflags', '+faststart', output]);
	console.log(`${output} <- ${master}`);
}
