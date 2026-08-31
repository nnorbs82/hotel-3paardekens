# Hotel 3 Paardekens Website

This repository contains the website for Hotel 3 Paardekens in Mechelen, Belgium.

## Current website workflow

The redesigned website is maintained as a static site with Git-backed content editing:

- **GitHub** stores the website source, content and hotel photography.
- **Pages CMS** provides the non-code editing interface for hotel content, room descriptions, amenities, room galleries, Hotel Info and Wallet FAQs.
- **Cloudflare Pages** builds and serves the website and automatically creates preview deployments from the `redesign` branch.
- **Mews** remains the booking engine and source of reservation availability.

No Firebase database or Firebase admin panel is required by the redesigned public website.

## Branches

- `main` - current production website until the redesign is formally approved for launch.
- `redesign` - current redesigned website and Cloudflare preview branch.

Do not merge `redesign` into `main` until the production cutover has been approved.

## Editing content with Pages CMS

1. Sign in to Pages CMS with GitHub.
2. Open `nnorbs82/hotel-3paardekens`.
3. Select the `redesign` branch while the redesign is still in preview.
4. Edit the relevant content section and save.
5. Pages CMS commits the change to GitHub.
6. Cloudflare Pages automatically creates an updated preview deployment.

The Pages CMS configuration is stored in `.pages.yml`.

## CMS-managed content

Current editable content includes:

- Homepage and hotel details
- Room names, descriptions and amenities in supported languages
- Room gallery images and image order
- Hotel information sections
- Google Wallet FAQs
- Apple Wallet FAQs

Structured content is stored under `v2/content/`.

## Room photography

Room photography is stored in the repository under `Rooms/`. The first image in a room's CMS Gallery is used as that room's lead image on the redesigned website. Gallery ordering therefore controls both the visible lead image and the full room gallery.

Only genuine Hotel 3 Paardekens photography should be used on the public hotel website.

## Booking

The website sends guests to the Hotel 3 Paardekens Mews Distributor for availability and booking. The redesigned booking bar and custom calendar are maintained in the root website files.

## Preview and production

The redesign remains `noindex` while it is being reviewed on Cloudflare preview deployments. Search-engine indexing is enabled only during the final production launch switch. The production SEO layer uses the canonical apex domain `https://3paardekens.com`, five language variants, hreflang, sitemap entries, social metadata and Hotel structured data.

## Security

Never commit passwords, private API keys, service-account credentials or other secrets to this repository. Public client identifiers should still be documented only where they are genuinely required.

Legacy credentials that were previously committed must be treated as compromised and rotated at the relevant service, because removing them from the latest version does not remove them from Git history.
