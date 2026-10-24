// Optional end-to-end check: install Playwright, Sharp and pixelmatch, then run this file.
// All requests to the production hostname are served from this local checkout.
const { chromium } = require('playwright');
const sharp = require('sharp');
const pixelmatchModule = require('pixelmatch');
const pixelmatch = pixelmatchModule.default || pixelmatchModule;
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const defaults = JSON.parse(fs.readFileSync(path.join(root, 'v2/content/images.json')));
const pages = fs.readdirSync(root).filter(name => name.endsWith('.html'));
const languages = ['en', 'nl', 'fr', 'es', 'de'];
const mime = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.ico': 'image/x-icon' };
const baselineFiles = new Map();
const externalResources = new Map();
const compare = process.argv.includes('--compare-main');
const get = (data, key) => key.split('.').reduce((v, k) => v?.[k], data);
const replacement = JSON.parse(JSON.stringify(defaults));
for (const [group, fields] of Object.entries(replacement)) {
  for (const key of Object.keys(fields)) fields[key] = `/elisabeth/sisterhotel.jpg?cms-test=${group}.${key}`;
}

async function samePixels(before, after) {
  if (before.equals(after)) return true;
  const a = await sharp(before).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const b = await sharp(after).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  if (a.info.width !== b.info.width || a.info.height !== b.info.height || a.data.length !== b.data.length) return false;
  // Exclude Chromium font-edge rasterization noise; geometry/styles are checked exactly below.
  const differing = pixelmatch(a.data, b.data, null, a.info.width, a.info.height, { threshold: 0.1, includeAA: false });
  return differing / (a.info.width * a.info.height) <= 0.001;
}

async function contextFor(browser, mode, viewport = { width: 1440, height: 1000 }) {
  const context = await browser.newContext({ viewport, reducedMotion: 'reduce', locale: 'en-GB' });
  // Both contexts must use the same font/CDN bytes during a comparison.
  await context.route(/^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net)\//, async route => {
    const url = route.request().url();
    if (!externalResources.has(url)) externalResources.set(url, (async () => {
      const response = await route.fetch();
      return { status: response.status(), headers: response.headers(), body: await response.body() };
    })());
    await route.fulfill(await externalResources.get(url));
  });
  await context.route('https://3paardekens.com/**', async route => {
    const url = new URL(route.request().url());
    const file = decodeURIComponent(url.pathname.slice(1)) || 'index.html';
    if (file === 'v2/content/images.json') {
      if (mode === 'missing') return route.fulfill({ status: 404, body: '' });
      if (mode === 'malformed') return route.fulfill({ contentType: 'application/json', body: '{broken' });
      if (mode === 'changed' || mode === 'broken') {
        const data = mode === 'changed' ? replacement : Object.fromEntries(Object.entries(defaults).map(([group, fields]) => [group, Object.fromEntries(Object.keys(fields).map(key => [key, '/missing-image.webp']))]));
        return route.fulfill({ contentType: 'application/json', body: JSON.stringify(data) });
      }
    }
    const localPath = path.resolve(root, file);
    if (!localPath.startsWith(`${root}${path.sep}`) || !fs.existsSync(localPath)) return route.fulfill({ status: 404, body: '' });
    let body;
    if (mode === 'baseline' && /\.(html|js|json|css)$/.test(file)) {
      if (!baselineFiles.has(file)) {
        baselineFiles.set(file, execFileSync('git', ['show', `origin/main:${file}`], { cwd: root }));
      }
      body = baselineFiles.get(file);
    } else body = fs.readFileSync(localPath);
    return route.fulfill({ contentType: mime[path.extname(file)] || 'application/octet-stream', body });
  });
  return context;
}

async function settle(page, file, language) {
  await page.goto(`https://3paardekens.com/${file}?lang=${language}`);
  await page.waitForLoadState('networkidle');
  await page.evaluate(async () => {
    await document.fonts.ready;
    document.querySelectorAll('img[src]').forEach(image => { image.loading = 'eager'; });
    await Promise.all([...document.querySelectorAll('img[src]')].map(image => image.decode().catch(() => {})));
    // Put scroll-reveal sections in their final state for deterministic pixel comparison.
    document.querySelectorAll('.reveal, .intro').forEach(node => node.classList.add('is-visible'));
  });
}

async function snapshot(page) {
  return page.evaluate(() => ({
    title: document.title,
    language: document.documentElement.lang,
    text: document.body.innerText,
    links: [...document.querySelectorAll('a')].map(a => a.getAttribute('href')),
    images: [...document.querySelectorAll('img[src]')].map(img => ({ src: img.getAttribute('src'), alt: img.alt, width: img.width, height: img.height, fit: getComputedStyle(img).objectFit, position: getComputedStyle(img).objectPosition })),
    galleries: [...document.querySelectorAll('[data-gallery]')].map(node => node.dataset.gallery),
    meta: [...document.querySelectorAll('meta[data-seo-key]')].map(node => [node.dataset.seoKey, node.content]).sort(),
    canonical: document.querySelector('link[rel=canonical]')?.href,
    hreflang: [...document.querySelectorAll('link[hreflang]')].map(node => [node.hreflang, node.href]),
    structuredData: document.querySelector('script[data-seo-jsonld]')?.textContent,
    layout: [...document.querySelectorAll('header, main, section, article, h1, h2, h3, p, a, button, footer')].map(node => {
      const rect = node.getBoundingClientRect();
      const css = getComputedStyle(node);
      return [node.tagName, rect.x, rect.y, rect.width, rect.height, css.fontFamily, css.fontSize, css.fontWeight, css.color, css.backgroundColor, css.transform];
    })
  }));
}

(async () => {
  const macChrome = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
  const executablePath = process.env.CHROME_PATH || (process.platform === 'darwin' && fs.existsSync(macChrome) ? macChrome : undefined);
  const browser = await chromium.launch({ headless: true, ...(executablePath ? { executablePath } : {}) });
  try {
    let checks = 0;
    for (const viewport of [{ width: 1440, height: 1000 }, { width: 390, height: 844 }]) {
      const baseline = compare ? await contextFor(browser, 'baseline', viewport) : null;
      const current = await contextFor(browser, 'default', viewport);
      const files = viewport.width === 390 ? ['index.html', 'rooms.html', 'info.html'] : pages;
      for (const file of files) for (const language of languages) {
        const page = await current.newPage();
        const errors = [];
        page.on('pageerror', error => errors.push(error.message));
        await settle(page, file, language);
        const actual = await snapshot(page);
        assert.equal(actual.language, language);
        assert.equal(await page.locator('img[src]').evaluateAll(images => images.filter(i => !i.complete || !i.naturalWidth).length), 0, `${file}/${language}: broken image`);
        if (baseline) {
          const before = await baseline.newPage();
          const beforeErrors = [];
          before.on('pageerror', error => beforeErrors.push(error.message));
          await settle(before, file, language);
          assert.deepEqual(actual, await snapshot(before), `${viewport.width}/${file}/${language}: behavior or SEO changed`);
          assert.deepEqual(errors, beforeErrors, `${file}: new JavaScript errors`);
          const options = { fullPage: true, animations: 'disabled', caret: 'hide' };
          await before.bringToFront();
          const beforeImage = await before.screenshot(options);
          await page.bringToFront();
          const afterImage = await page.screenshot(options);
          const equal = await samePixels(beforeImage, afterImage);
          if (!equal) {
            const artifacts = process.env.BROWSER_ARTIFACTS || path.resolve(root, '../browser-checks');
            fs.mkdirSync(artifacts, { recursive: true });
            fs.writeFileSync(path.join(artifacts, 'before.png'), beforeImage);
            fs.writeFileSync(path.join(artifacts, 'after.png'), afterImage);
          }
          assert.ok(equal, `${viewport.width}/${file}/${language}: pixels changed`);
          await before.close();
        } else assert.deepEqual(errors, []);
        await page.close();
        checks++;
      }
      await current.close();
      if (baseline) await baseline.close();
      console.log(`PASS: ${checks} page/language/viewport checks${compare ? ', including unchanged pixels, content, links, room images and SEO against origin/main' : ''}`);
    }

    const changed = await contextFor(browser, 'changed');
    for (const file of pages) for (const language of languages) {
      const page = await changed.newPage();
      await settle(page, file, language);
      const values = await page.locator('[data-site-image]').evaluateAll(nodes => nodes.map(n => [n.dataset.siteImage, n.getAttribute(n.tagName === 'LINK' ? 'href' : 'src')]));
      for (const [key, value] of values) assert.equal(value, get(replacement, key), `${file}/${language}: ${key}`);
      assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'), `https://3paardekens.com${replacement.seo.socialImage}`);
      const hotel = JSON.parse(await page.locator('script[data-seo-jsonld]').textContent())['@graph'][0];
      assert.equal(hotel.logo, `https://3paardekens.com${replacement.branding.logo}`);
      assert.deepEqual(hotel.image, [replacement.seo.socialImage, replacement.home.breakfast, replacement.home.ctaLeft].map(src => `https://3paardekens.com${src}`));
      if (file === 'rooms.html') {
        for (const id of ['single', 'twin', 'double', 'double-deluxe']) {
          const gallery = JSON.parse(await page.locator(`#${id}`).getAttribute('data-gallery'));
          const room = JSON.parse(fs.readFileSync(path.join(root, `v2/content/rooms/${id}.json`)));
          assert.equal(gallery.length, room.gallery.length);
          await page.locator(`#${id} .room-feature-image`).click();
          assert.equal(await page.locator('.lightbox-image').getAttribute('src'), gallery[0]);
          await page.keyboard.press('ArrowRight');
          assert.equal(await page.locator('.lightbox-image').getAttribute('src'), gallery[1 % gallery.length]);
          await page.keyboard.press('Escape');
          assert.equal(await page.locator('.lightbox.is-open').count(), 0);
        }
      }
      await page.close();
    }
    await changed.close();
    console.log('PASS: replacement of every control across all 40 page/language combinations, shared SEO images, and all room lightboxes');

    for (const mode of ['missing', 'malformed', 'broken']) {
      const context = await contextFor(browser, mode);
      for (const file of ['index.html', 'rooms.html', 'info.html']) {
        const page = await context.newPage();
        await settle(page, file, 'fr');
        const values = await page.locator('[data-site-image]').evaluateAll(nodes => nodes.map(n => [n.dataset.siteImage, n.getAttribute(n.tagName === 'LINK' ? 'href' : 'src')]));
        for (const [key, value] of values) assert.equal(`/${value}`, get(defaults, key), `${mode}: ${key}`);
        assert.equal(await page.locator('meta[property="og:image"]').getAttribute('content'), `https://3paardekens.com${defaults.seo.socialImage}`);
        await page.close();
      }
      await context.close();
    }
    console.log('PASS: unavailable/invalid CMS content and broken replacement images preserve HTML and SEO fallbacks');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
