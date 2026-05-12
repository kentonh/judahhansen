(() => {
  document.querySelectorAll('.project-card-film-toggle').forEach((btn) => {
    const gallery = document.getElementById(btn.getAttribute('aria-controls'));
    if (!gallery) return;
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      gallery.hidden = open;
    });
  });

  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.hidden = true;
  lightbox.innerHTML = '<img alt="">';
  document.body.appendChild(lightbox);
  const lightboxImg = lightbox.querySelector('img');

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImg.removeAttribute('src');
  };

  document.querySelectorAll('.project-gallery img').forEach((img) => {
    img.addEventListener('click', () => {
      lightboxImg.src = img.currentSrc || img.src;
      lightboxImg.alt = img.alt;
      lightbox.hidden = false;
    });
  });

  lightbox.addEventListener('click', closeLightbox);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
})();
