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

- `main` - the live redesigned production website at https://3paardekens.com.
- `redesign` - the earlier redesign preview branch.

Prepare changes in a review branch and pull request targeting `main`. Merging to production requires approval.

## Editing content with Pages CMS

1. Sign in to Pages CMS with GitHub.
2. Open `nnorbs82/hotel-3paardekens`.
3. Select `main` for the live website. To review an unmerged change, select its review branch instead.
4. Edit the relevant content section and save.
5. Pages CMS commits the change to GitHub.
6. Cloudflare Pages publishes the change for the selected branch according to its deployment settings.

The Pages CMS configuration is stored in `.pages.yml`.

## CMS-managed content

Current editable content includes:

- Homepage and hotel details
- Room names, descriptions and amenities in supported languages
- Room gallery images and image order
- All fixed website photos, shared branding and social preview images
- Hotel information sections
- Google Wallet FAQs
- Apple Wallet FAQs

Structured content is stored under `v2/content/`.

## Room photography

Room photography is stored in the repository under `Rooms/`. The first image in a room's CMS Gallery is used as that room's lead image on the redesigned website. Gallery ordering therefore controls both the visible lead image and the full room gallery.

Only genuine Hotel 3 Paardekens photography should be used on the public hotel website.

## Website images in Pages CMS

Open **Website images - all languages > Page photos, shared images & logos**. The sections describe each placement. Remove the current selection, then select an existing image or upload its replacement and save. Each field opens its matching image library: **Website images - general & logos**, **Website images - page photos**, or **Sister hotel photography**. Select an image there or upload directly in the field. Their public paths match the static site's actual file paths. The existing room/hotel/upload libraries remain available.

All five languages share these image settings in `v2/content/images.json`:

| CMS section / control | Used on the website |
| --- | --- |
| Branding / Hotel logo | Header and footer of all eight pages; Hotel structured data |
| Branding / Browser tab icon | All eight pages |
| Shared hotel photography / Hotel lounge | Homepage hero and location photo; Hotel Info banner |
| Homepage / Cathedral | Large photo in the About section |
| Homepage / Hotel detail | Small overlapping photo in the About section |
| Homepage / Breakfast | Breakfast section; Hotel structured data |
| Homepage / Sister property | Hotel Elisabeth section |
| Homepage / Bottom booking section, left | Decorative Double Deluxe photo; Hotel structured data |
| Homepage / Bottom booking section, middle | Decorative Twin photo |
| Homepage / Bottom booking section, right | Decorative Single photo |
| Rooms page / Banner | Wide photo behind the Rooms heading |
| Social sharing / Social preview | Open Graph and Twitter image; first Hotel structured-data photo |

The same logo and browser tab icon cover Home, Rooms, Hotel Info, both Wallet FAQ pages, Privacy, Cookie Policy and Terms. There are no other fixed content images, CSS image backgrounds or language-specific image copies on these pages. The lightbox image is created dynamically from the existing room galleries.

**Hotel content > Rooms > Gallery** still controls room cards, feature images, thumbnails, image counts, ordering and lightboxes. The Rooms banner and three decorative homepage booking photos have their own controls; changing them does not change a room gallery.

**Website images - all languages > App icons - 192 & 512 pixels** edits the two existing PNG entries directly in `site.webmanifest`. This optional manifest is currently not linked from the page heads; its behavior and other values are preserved.

Current photos remain in the HTML and SEO code as fallbacks. The favicon is mirrored byte-for-byte into `assets/favicon.ico` so the CMS can select it from a supported, nonempty media directory; the original root `favicon.ico` is retained for existing links. Clearing a setting, a missing/invalid content file, a failed replacement download or disabled JavaScript keeps the original page image. The new loader also accepts existing `/images/legacy/rooms/`, `/images/legacy/about/` and `/images/uploads/` paths. It leaves the existing room-gallery loader unchanged. As with the existing site, social and structured metadata are populated by the production SEO script.

## Validation

There is no package installation, bundler or application build step: the repository root is the deployable static site. Run:

```sh
node --test tests/site-images.test.cjs
python3 tests/audit-site.py
ruby tests/cms-config.rb
```

The optional browser suite requires Playwright, a Chromium browser, Sharp and pixelmatch:

```sh
node tests/browser-images.cjs
node tests/browser-images.cjs --compare-main
```

Set `CHROME_PATH` to use an installed Chrome executable (macOS Chrome is detected automatically). The comparison uses the locally fetched `origin/main`; refresh that ref before comparing. All production-host requests are intercepted and served from the checkout, so this test does not change the live website. It checks all eight pages in five languages, three key pages at mobile size, replacement images, fallbacks, SEO and room lightboxes. Element geometry, typography settings and colors are compared exactly; screenshot comparisons exclude font-edge rasterization noise and allow a maximum difference of 0.1% of pixels. External fonts and the existing DOMPurify CDN are loaded normally.

## Booking

The website sends guests to the Hotel 3 Paardekens Mews Distributor for availability and booking. The redesigned booking bar and custom calendar are maintained in the root website files.

## Preview and production

The redesign remains `noindex` while it is being reviewed on Cloudflare preview deployments. Search-engine indexing is enabled only during the final production launch switch. The production SEO layer uses the canonical apex domain `https://3paardekens.com`, five language variants, hreflang, sitemap entries, social metadata and Hotel structured data.

## Security

Never commit passwords, private API keys, service-account credentials or other secrets to this repository. Public client identifiers should still be documented only where they are genuinely required.

Legacy credentials that were previously committed must be treated as compromised and rotated at the relevant service, because removing them from the latest version does not remove them from Git history.
