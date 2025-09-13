const els = {
  chips: document.getElementById('categoryChips'),
  grid: document.getElementById('menuGrid'),
  empty: document.getElementById('emptyState'),
  search: document.getElementById('searchInput'),
  year: document.getElementById('year'),
  themeToggle: document.getElementById('themeToggle'),
  lightbox: document.getElementById('logoLightbox'),
  lightboxImg: document.getElementById('lightboxImg'),
};

const state = {
  items: [],
  categories: [],
  activeCategory: 'Tudo',
  query: '',
};

init();

function init() {
  setYear();
  setupTheme();
  const data = (window.MENU_DATA && Array.isArray(window.MENU_DATA.items)) ? window.MENU_DATA : { items: [] };
  state.items = data.items;
  const cats = new Set(['Tudo', ...state.items.map(i => i.category)]);
  state.categories = Array.from(cats);
  renderChips();
  bindEvents();
  render();
}

function setYear() {
  els.year.textContent = new Date().getFullYear();
}

function setupTheme() {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark') document.documentElement.classList.add('dark');
  els.themeToggle.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
    const isDark = document.documentElement.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}

function bindEvents() {
  els.search.addEventListener('input', (e) => {
    state.query = e.target.value.trim().toLowerCase();
    render();
  });

  // Clique no logo do cabeçalho e do rodapé para abrir lightbox
  const headerLogo = document.querySelector('.branding .logo');
  const footerLogo = document.getElementById('footerLogo');
  if (headerLogo) headerLogo.addEventListener('click', () => openLightbox(headerLogo.getAttribute('src')));
  if (footerLogo) footerLogo.addEventListener('click', () => openLightbox(footerLogo.getAttribute('src')));

  // Fechar lightbox ao clicar fora da imagem
  if (els.lightbox) {
    els.lightbox.addEventListener('click', (e) => {
      if (e.target === els.lightbox) closeLightbox();
    });
  }

  // Fechar com Esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
}

function renderChips() {
  els.chips.innerHTML = '';
  state.categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'chip' + (state.activeCategory === cat ? ' active' : '');
    btn.textContent = cat;
    btn.addEventListener('click', () => {
      state.activeCategory = cat;
      document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      render();
    });
    els.chips.appendChild(btn);
  });
}

function render() {
  const filtered = state.items.filter((item) => {
    const byCat = state.activeCategory === 'Tudo' || item.category === state.activeCategory;
    const q = state.query;
    const byQuery = !q ||
      item.name.toLowerCase().includes(q) ||
      (item.description || '').toLowerCase().includes(q) ||
      (item.tags || []).some(t => t.toLowerCase().includes(q));
    return byCat && byQuery;
  });

  els.grid.innerHTML = '';
  if (filtered.length === 0) {
    els.empty.classList.remove('hidden');
    return;
  }
  els.empty.classList.add('hidden');

  for (const item of filtered) {
    const card = document.createElement('article');
    card.className = 'card';

    const thumb = document.createElement('div');
    thumb.className = 'thumb';
    if (item.image) {
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.name;
      img.className = 'thumb';
      thumb.replaceWith(img);
    } else {
      thumb.textContent = item.emoji || '🍽️';
    }

    const content = document.createElement('div');
    const title = document.createElement('h3');
    title.textContent = item.name;

    const desc = document.createElement('p');
    desc.textContent = item.description || '';

    const row = document.createElement('div');
    row.className = 'row';

    const price = document.createElement('div');
    price.className = 'price';
    price.textContent = (item.price && item.price > 0) ? formatBRL(item.price) : 'Preço a definir';

    const tags = document.createElement('div');
    tags.className = 'taglist';
    (item.tags || []).forEach(t => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = t;
      tags.appendChild(span);
    });

    row.appendChild(price);
    row.appendChild(tags);

    content.appendChild(title);
    if (item.description) content.appendChild(desc);
    content.appendChild(row);

    card.appendChild(thumb);
    card.appendChild(content);

    els.grid.appendChild(card);
  }
}

function formatBRL(v) {
  try {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);
  } catch {
    return 'R$ ' + (v ?? 0);
  }
}

// Lightbox helpers
function openLightbox(src) {
  if (!els.lightbox || !els.lightboxImg) return;
  els.lightboxImg.src = src;
  els.lightbox.classList.remove('hidden');
}

function closeLightbox() {
  if (!els.lightbox || !els.lightboxImg) return;
  els.lightbox.classList.add('hidden');
  els.lightboxImg.removeAttribute('src');
}
