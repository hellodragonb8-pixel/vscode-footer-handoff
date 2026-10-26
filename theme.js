/*
 * Footer theme switcher: System, Light or Dark.
 *
 * The choice is saved in localStorage ("vscode-theme") and applied as
 * data-theme="light" | "dark" on <html>. "System" removes the attribute, so
 * the OS setting decides. An inline script in <head> applies a saved choice
 * before first paint to avoid a flash of the wrong theme.
 *
 * Exploration build: footer.html?v=1 to ?v=7 picks which control design is
 * drawn into the footer's [data-theme-slot]. Once one is chosen, its markup
 * can be written into footer.html directly and the others removed.
 */
window.FT_THEME = (() => {
  const KEY = 'vscode-theme';
  const MODES = ['system', 'light', 'dark'];
  const NAMES = { system: 'System', light: 'Light', dark: 'Dark' };
  const root = document.documentElement;
  const osDark = window.matchMedia('(prefers-color-scheme: dark)');

  const svg = (body) => `<svg class="ft-ti" viewBox="0 0 16 16" aria-hidden="true" focusable="false">${body}</svg>`;
  const ICONS = {
    system: svg('<rect x="1.75" y="2.75" width="12.5" height="8.5" rx="1.5"/><path d="M8 11.25v2.5M5.25 13.75h5.5"/>'),
    light: svg('<circle cx="8" cy="8" r="2.75"/><path d="M8 1.5V3M8 13v1.5M1.5 8H3M13 8h1.5M3.4 3.4l1.06 1.06M11.54 11.54l1.06 1.06M3.4 12.6l1.06-1.06M11.54 4.46l1.06-1.06"/>'),
    dark: svg('<path d="M13.25 9.6A5.5 5.5 0 0 1 6.4 2.75a5.5 5.5 0 1 0 6.85 6.85z"/>'),
  };

  // ------------------------------------------------------------------ state

  const read = () => {
    try { const v = localStorage.getItem(KEY); return MODES.includes(v) ? v : 'system'; } catch { return 'system'; }
  };
  const write = (mode) => {
    try { if (mode === 'system') localStorage.removeItem(KEY); else localStorage.setItem(KEY, mode); } catch { /* storage unavailable */ }
  };
  const effective = (mode) => (mode === 'system' ? (osDark.matches ? 'dark' : 'light') : mode);
  const applyAttr = (mode) => {
    if (mode === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', mode);
  };

  let mode = read();

  // --------------------------------------------------------------- controls

  // Three options as an ARIA radio group. Arrow keys move between them.
  const radios = (cls, { text = false, swatch = false } = {}) =>
    `<div class="${cls}" role="radiogroup" aria-label="Theme">${MODES.map((m) =>
      `<button type="button" role="radio" data-mode="${m}"${text ? '' : ` aria-label="${NAMES[m]}" title="${NAMES[m]}"`}>${
        swatch ? `<span class="ft-sw ft-sw--${m}"></span>` : text === 'only' ? NAMES[m] : `${ICONS[m]}${text ? `<span>${NAMES[m]}</span>` : ''}`
      }</button>`).join('')}</div>`;

  // label: the row title on mobile. showLabel: also shown on desktop.
  const VARIANTS = {
    1: { name: 'Icon pill', label: 'Theme', html: () => radios('ft-seg') },
    2: { name: 'Labeled pill', label: 'Theme', html: () => radios('ft-seg ft-seg--labels', { text: true }) },
    3: { name: 'Dark mode switch', label: 'Dark mode', showLabel: true, html: () => '<button type="button" class="ft-switch" role="switch" data-switch aria-label="Dark mode"></button>' },
    4: { name: 'Cycle button', label: 'Theme', html: () => '<button type="button" class="ft-cycle" data-cycle></button>' },
    5: { name: 'Select menu', label: 'Theme', showLabel: true, html: () =>
      `<span class="ft-select"><span data-select-icon></span><select data-select aria-label="Theme">${MODES.map((m) => `<option value="${m}">${NAMES[m]}</option>`).join('')}</select></span>` },
    6: { name: 'Text options', label: 'Theme:', showLabel: true, html: () => radios('ft-text', { text: 'only' }) },
    7: { name: 'Appearance swatches', label: 'Theme', html: () => radios('ft-swatches', { swatch: true }) },
  };

  // Reflect the current mode in every control on the page.
  function sync() {
    document.querySelectorAll('.ft-theme [data-mode]').forEach((b) => {
      const on = b.dataset.mode === mode;
      b.setAttribute('aria-checked', String(on));
      b.tabIndex = on ? 0 : -1;
    });
    document.querySelectorAll('.ft-theme [data-switch]').forEach((b) => b.setAttribute('aria-checked', String(effective(mode) === 'dark')));
    document.querySelectorAll('.ft-theme [data-cycle]').forEach((b) => {
      b.innerHTML = `${ICONS[mode]}<span>${NAMES[mode]}</span>`;
      b.setAttribute('aria-label', `Theme: ${NAMES[mode]}`);
      b.title = 'Change theme';
    });
    document.querySelectorAll('.ft-theme [data-select]').forEach((s) => { s.value = mode; });
    document.querySelectorAll('.ft-theme [data-select-icon]').forEach((i) => { i.outerHTML = ICONS[mode].replace('<svg', '<svg data-select-icon'); });
  }

  function set(next) {
    mode = next;
    applyAttr(mode);
    write(mode);
    sync();
  }

  function wire(slot) {
    slot.addEventListener('click', (e) => {
      const radio = e.target.closest('[data-mode]');
      if (radio) set(radio.dataset.mode);
      if (e.target.closest('[data-switch]')) set(effective(mode) === 'dark' ? 'light' : 'dark');
      if (e.target.closest('[data-cycle]')) set(MODES[(MODES.indexOf(mode) + 1) % MODES.length]);
    });
    slot.addEventListener('change', (e) => {
      if (e.target.matches('[data-select]')) set(e.target.value);
    });
    slot.addEventListener('keydown', (e) => {
      const radio = e.target.closest('[data-mode]');
      if (!radio) return;
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      const next = MODES[(MODES.indexOf(radio.dataset.mode) + step + MODES.length) % MODES.length];
      set(next);
      slot.querySelector(`[data-mode="${next}"]`).focus();
    });
  }

  function mount() {
    const slot = document.querySelector('[data-theme-slot]');
    if (!slot) return;
    const v = new URLSearchParams(location.search).get('v');
    const variant = VARIANTS[v] || VARIANTS[1];
    slot.classList.toggle('ft-theme--label', Boolean(variant.showLabel));
    slot.innerHTML = `<span class="ft-theme-label" aria-hidden="true">${variant.label}</span>${variant.html()}`;
    wire(slot);
    sync();
  }

  // The switch shows the effective theme, so it follows OS changes in System mode.
  osDark.addEventListener('change', sync);
  // Keep other tabs and frames in step when the choice changes.
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY && e.key !== null) return;
    mode = read();
    applyAttr(mode);
    sync();
  });

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount); else mount();

  return { VARIANTS };
})();
