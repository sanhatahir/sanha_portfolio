// Keep navigation orientation visible without making content depend on JavaScript.
const links = [...document.querySelectorAll('nav a[href^="index.html#"]')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) links.forEach(link => {
        const active = link.hash === '#' + entry.target.id;
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -55% 0px' });
  document.querySelectorAll('section[id]').forEach(section => observer.observe(section));
}

// Enhance the certificate list while preserving links and tags without JavaScript.
const certificationSearch = document.querySelector('#certification-search');
if (certificationSearch) {
  const controls = document.querySelector('.certification-controls');
  const filters = [...controls.querySelectorAll('[data-certification-tag]')];
  const cards = [...document.querySelectorAll('.certification-card')];
  const status = document.querySelector('.certification-status');
  let selectedTag = '';
  const filterCertifications = () => {
    const query = certificationSearch.value.trim().toLowerCase().replace(/#/g, '');
    const terms = query.split(/\s+/).filter(Boolean);
    let visible = 0;
    cards.forEach(card => {
      const text = card.textContent.toLowerCase().replace(/#/g, '');
      const tags = card.dataset.certificationTags.split(' ');
      card.hidden = !(terms.every(term => text.includes(term)) && (!selectedTag || tags.includes(selectedTag)));
      if (!card.hidden) visible += 1;
    });
    status.hidden = false;
    status.textContent = visible ? `${visible} certification${visible === 1 ? '' : 's'} found.` : 'No certifications match. Try another search or select All topics.';
  };
  certificationSearch.addEventListener('input', filterCertifications);
  filters.forEach(button => button.addEventListener('click', () => {
    selectedTag = button.dataset.certificationTag;
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    filterCertifications();
  }));
  controls.hidden = false;
}
