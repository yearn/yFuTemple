### requires
node, pnpm


```
pnpm install
pnpm dev
```

`pnpm build` writes a static site to `dist/`, which any static file server can host:

```
pnpm build
python3 -m http.server -d dist
```

Images are committed pre-encoded at the sizes they are shown at, since a static export has no
image optimizer.

### assets

The comic pages, gallery artwork and soundtrack are committed pre-encoded (AVIF, Opus and AAC), with
the comic pages' sizes in `content/comics.json`. The scripts that produced them from the masters are
in git history, under `scripts/` as of commit 455bd69.
