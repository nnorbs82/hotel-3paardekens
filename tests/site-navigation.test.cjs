const assert = require('node:assert/strict');
const { readFileSync, readdirSync } = require('node:fs');
const { resolve, join } = require('node:path');
const { test } = require('node:test');
const vm = require('node:vm');

const root = resolve(__dirname, '..');
const translationScript = readFileSync(join(root, 'site-i18n-complete.js'), 'utf8');
const seoScript = readFileSync(join(root, 'site-seo.js'), 'utf8');
const copy = JSON.parse(readFileSync(join(root, 'v2/content/ui-i18n.json'))).copy;
const flush = () => new Promise(resolve => setImmediate(resolve));

// A small DOM fixture runs the actual translation and SEO scripts in both orders.
class Link {
  constructor(href, text = '') {
    this.attributes = { href };
    this.textContent = text;
    this.dataset = {};
    this.listeners = [];
  }
  set href(value) { this.attributes.href = value; }
  getAttribute(name) { return this.attributes[name] ?? null; }
  setAttribute(name, value) { this.attributes[name] = value; }
  removeAttribute(name) { delete this.attributes[name]; }
  hasAttribute(name) { return name in this.attributes; }
  addEventListener(name, callback) { this.listeners.push({ name, callback }); }
  closest() { return this.parent.header; }
  remove() { this.parent.links.splice(this.parent.links.indexOf(this), 1); }
}
class Container {
  constructor(html, explore = false) {
    this.explore = explore;
    this.links = [];
    this.attributes = {};
    this.toggle = { setAttribute: (name, value) => { this.toggle[name] = value; } };
    this.header = {
      classList: { remove: value => { this.closedClass = value; } },
      querySelector: () => this.toggle
    };
    for (const match of html.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g)) {
      this.appendChild(new Link(match[1], match[2].replace(/<[^>]*>/g, '')));
    }
  }
  querySelectorAll(selector) {
    assert.equal(selector, 'a[href]');
    return [...this.links];
  }
  querySelector(selector) {
    if (selector === 'h3[data-i18n="footer.explore"]') return this.explore ? {} : null;
    const exact = selector.match(/^a\[href="([^"]+)"\]$/)?.[1];
    if (exact) return this.links.find(link => link.getAttribute('href') === exact) || null;
    const fragment = selector.match(/^a\[href\*="(#[^"]+)"\]$/)?.[1];
    return this.links.find(link => link.getAttribute('href').includes(fragment)) || null;
  }
  setAttribute(name, value) { this.attributes[name] = value; }
  appendChild(link) { link.parent = this; this.links.push(link); }
  insertBefore(link, before) { link.parent = this; this.links.splice(this.links.indexOf(before), 0, link); }
}

async function load(page, order, href) {
  const html = readFileSync(join(root, page), 'utf8');
  const nav = new Container(html.match(/<nav\b[^>]*class="nav"[^>]*>([\s\S]*?)<\/nav>/)[1]);
  const explore = new Container(html.match(/<div class="footer-col"><h3 data-i18n="footer.explore">[\s\S]*?<\/div>/)[0], true);
  const help = new Container('<a href="https://example.org/info.html">Other hotel</a>');
  if (href) for (const container of [nav, explore]) {
    container.links.find(link => link.getAttribute('href') === 'info.html').href = href;
  }
  let language = 'en';
  const errors = [];
  const listeners = new Map();
  let finishUI;
  const ui = new Promise(resolve => { finishUI = resolve; });
  const document = {
    documentElement: { lang: 'en' },
    querySelector: () => null,
    querySelectorAll: selector => {
      if (selector === '.site-header .nav') return [nav];
      if (selector === '.site-footer .footer-col') return [explore, help];
      if (selector === 'a[href]') return [...nav.links, ...explore.links, ...help.links];
      return [];
    },
    createElement: () => new Link(''),
    addEventListener: (name, callback) => {
      if (!listeners.has(name)) listeners.set(name, []);
      listeners.get(name).push(callback);
    }
  };
  const context = vm.createContext({
    document, URL, console: { error: error => errors.push(String(error)) },
    location: { href: `https://hotel.test/${page}?lang=en`, pathname: `/${page}`, origin: 'https://hotel.test', hostname: 'hotel.test' },
    window: { Hotel3P: { getLanguage: () => language } },
    fetch: async () => ({ ok: true, json: async () => ui }),
    history: { replaceState() {} },
    requestAnimationFrame: callback => callback(),
    MutationObserver: class { observe() {} }
  });
  if (order === 'seo-first') {
    vm.runInContext(seoScript, context);
    vm.runInContext(translationScript, context);
  } else {
    vm.runInContext(translationScript, context);
    if (order === 'translations-first') {
      finishUI({ copy });
      await flush();
    }
    vm.runInContext(seoScript, context);
  }
  finishUI({ copy });
  await flush();
  assert.deepEqual(errors, []);
  return {
    nav, explore, help,
    async setLanguage(code) {
      language = code;
      for (const callback of listeners.get('hotelLanguageChanged')) callback();
      await flush();
      assert.deepEqual(errors, []);
    }
  };
}

function infoLinks(container) {
  return container.links.filter(link => new URL(link.getAttribute('href'), 'https://hotel.test/').pathname.replace(/\.html$/, '').replace(/\/$/, '') === '/info');
}

test('all eight pages keep one translated Info link in menu and footer regardless of script/fetch order', async () => {
  for (const page of readdirSync(root).filter(file => file.endsWith('.html'))) {
    for (const order of ['seo-first', 'translations-first', 'delayed-translations']) {
      const fixture = await load(page, order);
      const originals = [infoLinks(fixture.nav)[0], infoLinks(fixture.explore)[0]];
      const otherLinks = fixture.nav.links.filter(link => !originals.includes(link));
      for (const code of ['en', 'nl', 'fr', 'es', 'de', 'en', 'nl']) {
        await fixture.setLanguage(code);
        for (const [index, container] of [fixture.nav, fixture.explore].entries()) {
          const links = infoLinks(container);
          assert.equal(links.length, 1, `${page}/${order}/${code}`);
          assert.equal(links[0], originals[index], 'retain the existing link and its position');
          assert.equal(links[0].textContent, copy[code].navInfo);
          assert.equal(new URL(links[0].getAttribute('href'), 'https://hotel.test/').searchParams.get('lang'), code);
        }
      }
      assert.deepEqual(fixture.nav.links.filter(link => !originals.includes(link)), otherLinks);
      assert.equal(originals[0].listeners.length, 1, 'bind mobile menu close once');
      originals[0].listeners[0].callback();
      assert.equal(fixture.nav.closedClass, 'menu-open');
      assert.equal(fixture.nav.toggle['aria-expanded'], 'false');
      assert.equal(fixture.help.links[0].getAttribute('href'), 'https://example.org/info.html');
    }
  }
});

test('recognises query strings, hashes, absolute URLs and extensionless Info links', async () => {
  for (const href of ['info.html?lang=fr', '/info.html?source=menu#arrival', 'https://hotel.test/info.html?lang=de', '/info?lang=nl', '/info/?lang=es']) {
    const fixture = await load('index.html', 'seo-first', href);
    await fixture.setLanguage('fr');
    for (const container of [fixture.nav, fixture.explore]) {
      assert.equal(infoLinks(container).length, 1, href);
      const actual = new URL(infoLinks(container)[0].getAttribute('href'), 'https://hotel.test/');
      const original = new URL(href, 'https://hotel.test/');
      assert.equal(actual.searchParams.get('lang'), 'fr');
      assert.equal(actual.searchParams.get('source'), original.searchParams.get('source'));
      assert.equal(actual.hash, original.hash);
    }
  }
});

test('cleans up existing duplicates and still adds a missing link in the expected position', async () => {
  const fixture = await load('index.html', 'seo-first');
  const original = infoLinks(fixture.nav)[0];
  fixture.nav.appendChild(new Link('info.html', 'Info'));
  fixture.explore.appendChild(new Link('/info?lang=de', 'Info'));
  await fixture.setLanguage('nl');
  assert.deepEqual(infoLinks(fixture.nav), [original]);
  assert.equal(infoLinks(fixture.explore).length, 1);
  for (const container of [fixture.nav, fixture.explore]) infoLinks(container)[0].remove();
  await fixture.setLanguage('en');
  assert.equal(infoLinks(fixture.nav).length, 1);
  assert.equal(fixture.nav.links.at(-2), infoLinks(fixture.nav)[0]);
  assert.equal(infoLinks(fixture.explore).length, 1);
  assert.equal(fixture.explore.links.at(-2), infoLinks(fixture.explore)[0]);
});
