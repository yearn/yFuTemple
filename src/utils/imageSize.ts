import sharp from 'sharp';

// the pixel size of an image under public, read at build time
export async function imageSize(src: string): Promise<{width: number, height: number}> {
	const {width, height} = await sharp(`${process.cwd()}/public${src}`).metadata();
	return {width, height};
}
