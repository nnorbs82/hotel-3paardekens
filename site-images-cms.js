(() => {
  'use strict';

  // New selections use real repository paths. Accept older Pages CMS aliases too.
  const normalizeImage = value => {
    if (typeof value !== 'string' || !value.trim()) return '';
    let src = value.trim();
    if (!/^(https?:)?\/\//i.test(src)) {
      if (/^[a-z][a-z\d+.-]*:/i.test(src)) return '';
      src = `/${src.replace(/^(?:\.?\/)+/, '')}`;
      src = src
        .replace(/^\/images\/legacy\/rooms\//i, '/Rooms/')
        .replace(/^\/images\/legacy\/about\//i, '/aboutus/')
        .replace(/^\/images\/uploads\//i, '/v2/public/images/uploads/');
    }
    try {
      return /^https?:$/.test(new URL(src, document.baseURI).protocol) ? src : '';
    } catch (_) {
      return '';
    }
  };

  let images = {};
  const failedImages = new Set();
  const get = (key, fallback) => {
    const value = key.split('.').reduce((data, name) => data?.[name], images);
    const src = normalizeImage(value);
    return src && !failedImages.has(src) ? src : fallback;
  };

  const controller = new AbortController();
  const contentTimeout = setTimeout(() => controller.abort(), 5000);
  const ready = fetch('v2/content/images.json', { cache: 'no-store', signal: controller.signal })
    .then(response => response.ok ? response.json() : {})
    .then(data => { images = data || {}; })
    .catch(() => { /* Keep every original image when CMS content is unavailable. */ })
    .finally(() => clearTimeout(contentTimeout));

  // Only preload replacements needed on this page; unchanged defaults cost no requests.
  const replacements = new Map();
  const canLoad = src => {
    if (!replacements.has(src)) {
      replacements.set(src, new Promise(resolve => {
        const image = new Image();
        const timeout = setTimeout(() => finish(false), 10000);
        const finish = success => {
          clearTimeout(timeout);
          image.onload = image.onerror = null;
          if (!success) failedImages.add(src);
          resolve(success);
        };
        image.onload = () => finish(true);
        image.onerror = () => finish(false);
        image.src = src;
      }));
    }
    return replacements.get(src);
  };

  const resolve = async (key, fallback) => {
    await ready;
    const src = get(key, fallback);
    if (!src || new URL(src, document.baseURI).href === new URL(fallback, document.baseURI).href) return fallback;
    return await canLoad(src) ? src : fallback;
  };

  window.Hotel3PImages = { get, ready, resolve };

  const applyImages = async () => {
    await ready;
    await Promise.all([...document.querySelectorAll('[data-site-image]')].map(async node => {
      const attribute = node.tagName === 'LINK' ? 'href' : 'src';
      const original = node.getAttribute(attribute);
      const replacement = await resolve(node.dataset.siteImage, original);
      if (replacement && replacement !== original) node.setAttribute(attribute, replacement);
    }));
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyImages, { once: true });
  } else {
    applyImages();
  }
})();
