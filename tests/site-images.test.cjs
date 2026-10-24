const assert = require('node:assert/strict');
const { readFileSync, readdirSync, existsSync } = require('node:fs');
const { resolve, join } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const root = resolve(__dirname, '..');
const source = readFileSync(join(root, 'site-images-cms.js'), 'utf8');
const defaults = JSON.parse(readFileSync(join(root, 'v2/content/images.json'), 'utf8'));
const valueAt = (data, key) => key.split('.').reduce((v, name) => v?.[name], data);
const flush = () => new Promise(resolve => setImmediate(resolve));
const node = (key, src, tagName = 'IMG') => ({
  tagName,
  dataset: { siteImage: key },
  attributes: { [tagName === 'LINK' ? 'href' : 'src']: src, alt: 'Original description' },
  getAttribute(name) { return this.attributes[name]; },
  setAttribute(name, value) { this.attributes[name] = value; }
});

async function load({ data = defaults, nodes = [], failure, broken = [] } = {}) {
  const loads = [];
  const requests = [];
  const document = {
    baseURI: 'https://3paardekens.com/index.html?lang=fr',
    readyState: 'complete',
    querySelectorAll: () => nodes
  };
  class Image {
    set src(value) {
      loads.push(value);
      queueMicrotask(() => broken.includes(value) ? this.onerror?.() : this.onload?.());
    }
  }
  const context = {
    window: {}, document, Image, URL, AbortController, setTimeout, clearTimeout,
    fetch: async (url, options) => {
      requests.push({ url, options });
      if (failure === 'network') throw new Error('offline');
      return {
        ok: failure !== '404',
        json: async () => {
          if (failure === 'json') throw new Error('invalid JSON');
          return data;
        }
      };
    }
  };
  vm.runInNewContext(source, context);
  await context.window.Hotel3PImages.ready;
  await flush();
  return { api: context.window.Hotel3PImages, loads, requests };
}

test('every fixed page image and favicon has a populated CMS control; room galleries stay separate', () => {
  const used = new Set(['seo.socialImage']);
  const pages = readdirSync(root).filter(file => file.endsWith('.html'));
  assert.equal(pages.length, 8);
  for (const file of pages) {
    const html = readFileSync(join(root, file), 'utf8');
    assert.ok(html.indexOf('site-images-cms.js') < html.indexOf('preview-site.js'), file);
    const tags = html.match(/<img\b[^>]*>|<link\b[^>]*rel="icon"[^>]*>/g) || [];
    for (const tag of tags) {
      const key = tag.match(/data-site-image="([^"]+)"/)?.[1];
      const src = tag.match(/(?:src|href)="([^"]+)"/)?.[1];
      if (!key) {
        assert.ok(src.startsWith('optimized/Rooms/'), `${file}: uncontrolled image ${src}`);
        continue;
      }
      assert.equal(valueAt(defaults, key), `/${src}`, `${file}: changed default for ${key}`);
      assert.ok(existsSync(join(root, src)), `${file}: missing default ${src}`);
      used.add(key);
    }
  }
  const keys = Object.entries(defaults).flatMap(([group, fields]) => Object.keys(fields).map(key => `${group}.${key}`));
  assert.deepEqual([...used].sort(), keys.sort());
});

test('defaults preserve image attributes and avoid preloading unchanged photos', async () => {
  const images = [node('shared.hotelExterior', 'optimized/assets/background.webp'), node('branding.favicon', 'assets/favicon.ico', 'LINK')];
  const { loads, requests } = await load({ nodes: images });
  assert.deepEqual(loads, []);
  assert.equal(images[0].attributes.src, 'optimized/assets/background.webp');
  assert.equal(images[1].attributes.href, 'assets/favicon.ico');
  assert.equal(requests.length, 1);
  assert.equal(requests[0].options.cache, 'no-store');
});

test('one replacement updates shared placements with one preload and preserves descriptions', async () => {
  const images = Array.from({ length: 3 }, () => node('shared.hotelExterior', 'optimized/assets/background.webp'));
  const { loads } = await load({ data: { shared: { hotelExterior: '/assets/new-hotel.jpg' } }, nodes: images });
  assert.deepEqual(loads, ['/assets/new-hotel.jpg']);
  images.forEach(image => {
    assert.equal(image.attributes.src, '/assets/new-hotel.jpg');
    assert.equal(image.attributes.alt, 'Original description');
  });
});

for (const failure of ['network', '404', 'json']) {
  test(`${failure} content failure keeps the original images and metadata fallbacks`, async () => {
    const image = node('home.breakfast', 'assets/3paardekens-breakfast.webp');
    const { api, loads } = await load({ failure, nodes: [image] });
    assert.equal(image.attributes.src, 'assets/3paardekens-breakfast.webp');
    assert.equal(api.get('home.breakfast', '/fallback.webp'), '/fallback.webp');
    assert.deepEqual(loads, []);
  });
}

test('missing, cleared, malformed and unsafe fields retain per-placement fallbacks', async () => {
  for (const value of [null, '', ' ', [], {}, 'javascript:alert(1)', 'data:image/png;base64,abc', 'https://[invalid']) {
    const image = node('branding.logo', 'assets/3plogo.png');
    const { api, loads } = await load({ data: { branding: { logo: value } }, nodes: [image] });
    assert.equal(image.attributes.src, 'assets/3plogo.png');
    assert.equal(api.get('home.breakfast', '/fallback.webp'), '/fallback.webp');
    assert.deepEqual(loads, []);
  }
});

test('failed replacement leaves HTML in place and also falls back in SEO', async () => {
  const image = node('branding.logo', 'assets/3plogo.png');
  const { api } = await load({ data: { branding: { logo: '/missing.png' } }, broken: ['/missing.png'], nodes: [image] });
  assert.equal(image.attributes.src, 'assets/3plogo.png');
  assert.equal(api.get('branding.logo', '/assets/3plogo.png'), '/assets/3plogo.png');
  assert.equal(await api.resolve('branding.logo', '/assets/3plogo.png'), '/assets/3plogo.png');
});

test('new uploads, legacy aliases, relative paths and external images resolve correctly', async () => {
  for (const [value, expected] of [
    ['/images/legacy/rooms/Double/new.png', '/Rooms/Double/new.png'],
    ['/images/legacy/about/new.jpg', '/aboutus/new.jpg'],
    ['/images/uploads/new.webp', '/v2/public/images/uploads/new.webp'],
    ['v2/public/images/uploads/new.webp', '/v2/public/images/uploads/new.webp'],
    ['./assets/new.jpg', '/assets/new.jpg'],
    ['https://example.com/new.jpg', 'https://example.com/new.jpg'],
    ['//example.com/new.jpg', '//example.com/new.jpg']
  ]) {
    const { api } = await load({ data: { home: { breakfast: value } } });
    assert.equal(api.get('home.breakfast', '/fallback.webp'), expected);
  }
});
