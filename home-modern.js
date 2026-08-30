(() => {
  const signatureSheet = document.createElement('link');
  signatureSheet.rel = 'stylesheet';
  signatureSheet.href = 'intro-signature.css';
  document.head.appendChild(signatureSheet);

  // Keep the signature section compact and in proportion with the hero and rooms sections.
  const introScale = document.createElement('style');
  introScale.textContent = `
    .intro{padding:104px 0 112px!important}
    .intro::before{top:-28px!important;font-size:clamp(220px,30vw,430px)!important}
    .intro-grid{min-height:520px!important}
    .intro-image-wrap{height:520px!important}
    .intro-image-main{width:58%!important;height:100%!important;object-fit:cover!important;object-position:center center!important}
    .intro-image-small{width:43%!important;height:38%!important;bottom:34px!important;border-width:9px!important}
    .intro-image-wrap::after{width:86px!important;height:86px!important;right:11%!important;top:26px!important;font-size:43px!important}
    .intro-copy{padding:46px 50px!important;margin-left:4px!important}
    .intro-copy .eyebrow{margin-bottom:18px!important}
    .intro-copy .section-title{font-size:clamp(48px,4.8vw,72px)!important;line-height:.92!important}
    .intro-copy .lead{margin:27px 0 28px!important;padding-left:22px!important;font-size:17px!important;line-height:1.65!important}

    @media(max-width:980px){
      .intro{padding:90px 0 100px!important}
      .intro-grid{min-height:720px!important}
      .intro-image-wrap{height:510px!important}
      .intro-image-main{width:62%!important}
      .intro-image-small{width:40%!important;height:36%!important;bottom:46px!important}
      .intro-copy{margin:-70px 0 0!important;padding:48px 46px!important}
    }

    @media(max-width:680px){
      .intro{padding:72px 0 82px!important}
      .intro::before{font-size:58vw!important;top:16px!important}
      .intro-grid{min-height:0!important}
      .intro-image-wrap{height:380px!important}
      .intro-image-main{width:64%!important;height:100%!important}
      .intro-image-small{width:48%!important;height:35%!important;bottom:0!important;border-width:7px!important}
      .intro-image-wrap::after{width:68px!important;height:68px!important;right:5%!important;top:20px!important;font-size:34px!important}
      .intro-copy{width:calc(100% - 18px)!important;margin:-10px 0 0 auto!important;padding:38px 26px 42px!important}
      .intro-copy .section-title{font-size:clamp(46px,13vw,64px)!important}
      .intro-copy .lead{font-size:16px!important;margin:24px 0 25px!important}
    }
  `;
  document.head.appendChild(introScale);

  const items = document.querySelectorAll('.reveal, .intro');
  if (!items.length) return;

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach((item) => item.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  items.forEach((item) => observer.observe(item));
})();
