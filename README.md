### requires
node, yarn


```
yarn
yarn dev
```

`yarn build` writes a static site to `out/`, which any static file server can host:

```
yarn build
python3 -m http.server -d out
```

Images are committed pre-encoded at the sizes they are shown at, since a static export has no
image optimizer.

### comics

The comic pages in `public/comics` and their manifest `content/comics.json` are generated from the
print PDFs. Re-run the import when the source files change (needs poppler for `pdftoppm`):

```
yarn import-comics '<path to "pills comic final">'
```

### artwork and audio

Gallery artwork is encoded to AVIF from the masters in the yearn keybase archive, and the AAC
fallbacks of the soundtrack from its WAV masters (needs macOS ffmpeg for `aac_at`):

```
node scripts/encode-assets.mjs '<path to "keybase backup/yearnfinance">'
node scripts/encode-audio.mjs '<path to the "yfu temple" masters folder>'
```

⚠ incompatible with bun 1.0.27,
```
Server Error
Error: Missing getServerSnapshot, which is required for server-rendered content. Will revert to client rendering.

This error happened while generating the page. Any console logs will be displayed in the terminal window.
```
