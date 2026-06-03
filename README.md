# GLOW Project Page

Static academic project page for GLOW.

## Development

- `src/index.html` is the page source.
- `src/css/index.css` and `src/js/index.js` are project-specific code.
- `public/` contains page-owned static assets such as teaser images, placeholder media, PDFs, and `.nojekyll`.
- Vendor CSS, JS, and fonts are managed by npm and copied during build.

Run:

```sh
npm ci
npm run check
```

The build output is generated in `dist/`. Do not commit `dist/` or `node_modules/`; GitHub Actions builds `dist/` and deploys it to GitHub Pages.
