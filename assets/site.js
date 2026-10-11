// Keep the section menu in sync with the reader's position.
const sectionMenu = document.querySelector('.section-menu');
const desktopNavigation = window.matchMedia('(min-width: 1100px)');
if (sectionMenu) {
  const syncMenu = () => { sectionMenu.open = desktopNavigation.matches; };
  syncMenu();
  desktopNavigation.addEventListener('change', syncMenu);
}
const sectionLinks = [...document.querySelectorAll('.section-nav a')];
const sections = sectionLinks.map(link => document.getElementById(link.hash.slice(1))).filter(Boolean);
if (sections.length) {
  let scheduled = false;
  const updateSection = () => {
    scheduled = false;
    let current = sections[0];
    sections.forEach(section => {
      if (section.getBoundingClientRect().top <= 150) current = section;
    });
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
      current = sections[sections.length - 1];
    }
    sectionLinks.forEach(link => {
      if (link.hash === '#' + current.id) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  };
  const scheduleUpdate = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateSection);
    }
  };
  window.addEventListener('scroll', scheduleUpdate, { passive: true });
  window.addEventListener('resize', scheduleUpdate);
  updateSection();
}
sectionLinks.forEach(link => link.addEventListener('click', () => {
  if (!desktopNavigation.matches) sectionMenu.removeAttribute('open');
}));
if (sectionMenu) {
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && sectionMenu.open && !desktopNavigation.matches) {
      sectionMenu.removeAttribute('open');
      sectionMenu.querySelector('summary').focus();
    }
  });
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
