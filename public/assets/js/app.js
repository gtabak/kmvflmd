'use strict';

const DATA_PATH = 'data/duyurular.json';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric', month: 'long', year: 'numeric'
  }).format(date);
}

async function loadAnnouncements() {
  const response = await fetch(DATA_PATH, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Duyurular yüklenemedi: ${response.status}`);
  const data = await response.json();
  if (!Array.isArray(data)) throw new Error('Duyuru verisi liste olmalıdır.');
  return data
    .filter(item => item && item.yayinla !== false)
    .sort((a, b) => String(b.tarih).localeCompare(String(a.tarih)));
}

function cardTemplate(item) {
  const slug = encodeURIComponent(item.slug);
  return `
    <article class="announcement-card">
      <time datetime="${escapeHtml(item.tarih)}">${escapeHtml(formatDate(item.tarih))}</time>
      <h3>${escapeHtml(item.baslik)}</h3>
      <p>${escapeHtml(item.ozet || '')}</p>
      <a href="duyuru.html?slug=${slug}" aria-label="${escapeHtml(item.baslik)} duyurusunu oku">Devamını oku →</a>
    </article>`;
}

function showEmpty(container) {
  container.innerHTML = '<p class="empty-state">Henüz yayımlanmış bir duyuru bulunmuyor.</p>';
}

async function renderHomeAnnouncements() {
  const container = document.querySelector('#announcement-list');
  if (!container) return;
  try {
    const data = await loadAnnouncements();
    if (data.length === 0) return showEmpty(container);
    container.innerHTML = data.slice(0, 3).map(cardTemplate).join('');
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p class="empty-state">Duyurular şu anda görüntülenemiyor.</p>';
  }
}

async function renderAllAnnouncements() {
  const container = document.querySelector('#all-announcements');
  if (!container) return;
  try {
    const data = await loadAnnouncements();
    if (data.length === 0) return showEmpty(container);
    container.innerHTML = data.map(cardTemplate).join('');
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p class="empty-state">Duyurular şu anda görüntülenemiyor.</p>';
  }
}

function bodyToHtml(body) {
  if (!body) return '';
  return String(body)
    .split(/\n{2,}/)
    .map(paragraph => `<p>${escapeHtml(paragraph).replaceAll('\n', '<br>')}</p>`)
    .join('');
}

async function renderAnnouncementDetail() {
  const container = document.querySelector('#announcement-detail');
  if (!container) return;
  const slug = new URLSearchParams(window.location.search).get('slug');
  if (!slug) {
    container.innerHTML = '<p class="empty-state">Duyuru bulunamadı.</p>';
    return;
  }
  try {
    const data = await loadAnnouncements();
    const item = data.find(entry => entry.slug === slug);
    if (!item) {
      container.innerHTML = '<p class="empty-state">Duyuru bulunamadı.</p>';
      return;
    }
    document.title = `${item.baslik} | KMVFLMD`;
    container.innerHTML = `
      <time datetime="${escapeHtml(item.tarih)}">${escapeHtml(formatDate(item.tarih))}</time>
      <h1>${escapeHtml(item.baslik)}</h1>
      <div class="announcement-body">${bodyToHtml(item.icerik)}</div>`;
  } catch (error) {
    console.error(error);
    container.innerHTML = '<p class="empty-state">Duyuru şu anda görüntülenemiyor.</p>';
  }
}

function initMenu() {
  const button = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#main-menu');
  if (!button || !menu) return;
  button.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });
  menu.addEventListener('click', event => {
    if (event.target.matches('a')) {
      menu.classList.remove('open');
      button.setAttribute('aria-expanded', 'false');
    }
  });
}

function initYear() {
  document.querySelectorAll('[data-current-year]').forEach(el => {
    el.textContent = String(new Date().getFullYear());
  });
}

initMenu();
initYear();
renderHomeAnnouncements();
renderAllAnnouncements();
renderAnnouncementDetail();
