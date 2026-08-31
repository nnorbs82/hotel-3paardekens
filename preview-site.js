(() => {
  'use strict';
  const load = (src, next) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => next && next();
    document.head.appendChild(script);
  };

  if (document.readyState === 'loading') {
    document.write('<script src="preview-site-core.js"><\/script><script src="site-i18n-complete.js"><\/script>');
  } else {
    load('preview-site-core.js', () => load('site-i18n-complete.js'));
  }
})();
