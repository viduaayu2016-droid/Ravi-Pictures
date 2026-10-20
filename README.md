# Ravi Pictures website

Static website prepared for GitHub and Cloudflare Pages.

## Deployment settings

- Production branch: `main`
- Framework preset: None
- Build command: leave empty
- Build output directory: `public`
- Root directory: repository root

Connect this repository through Cloudflare Pages Git integration. Each push to main then deploys the site automatically. No API tokens or GitHub Actions secrets are required for the native integration.

## Files

- `public/index.html`: page and interactions
- `public/design-reference.png`: supplied design artwork
- `public/_headers`: response headers

The current design uses the supplied reference image with accessible interactive overlays. Text within the artwork is not editable HTML. The showreel opens the original website's video gallery. Project enquiries use email.

## Preview

Open `public/index.html` in a browser.

## Custom domain

After verifying the Cloudflare preview, add a custom domain through the Pages project's Custom domains section. The existing ravipictures.com domain has not been changed.

Cloudflare documentation: https://developers.cloudflare.com/pages/get-started/git-integration/
