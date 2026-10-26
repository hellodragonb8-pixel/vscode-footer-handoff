/*
 * Footer theme menu: System, Light or Dark.
 *
 * The choice is saved in localStorage ("vscode-theme") and applied as
 * data-theme="light" | "dark" on <html>. "System" removes the attribute, so
 * the OS setting decides. An inline script in <head> applies a saved choice
 * before first paint to avoid a flash of the wrong theme.
 *
 * The menu follows the WAI-ARIA menu button pattern: Enter, Space or the
 * arrow keys open it; arrows and Home/End move; Enter picks; Escape closes
 * and returns focus to the button. It also closes on a click elsewhere.
 */
(() => {
  const KEY = 'vscode-theme';
  const MODES = ['system', 'light', 'dark'];
  const root = document.documentElement;

  const theme = document.querySelector('.ft-theme');
  if (!theme) return;
  const btn = theme.querySelector('.ft-menubtn');
  const menu = theme.querySelector('.ft-menu');
  const items = [...menu.querySelectorAll('[data-theme-option]')];

  // ------------------------------------------------------------------ state

  const read = () => {
    try { const v = localStorage.getItem(KEY); return MODES.includes(v) ? v : 'system'; } catch { return 'system'; }
  };
  const write = (mode) => {
    try { if (mode === 'system') localStorage.removeItem(KEY); else localStorage.setItem(KEY, mode); } catch { /* storage unavailable */ }
  };
  const applyAttr = (mode) => {
    if (mode === 'system') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', mode);
  };

  let mode = read();

  // The button copies the icon and name of the checked menu item.
  function sync() {
    let current;
    items.forEach((item) => {
      const on = item.dataset.themeOption === mode;
      item.setAttribute('aria-checked', String(on));
      if (on) current = item;
    });
    const name = current.querySelector('span').textContent;
    btn.replaceChildren(current.querySelector('svg').cloneNode(true), Object.assign(document.createElement('span'), { textContent: name }));
    btn.setAttribute('aria-label', `Theme: ${name}`);
  }

  function set(next) {
    mode = next;
    applyAttr(mode);
    write(mode);
    sync();
  }

  // ------------------------------------------------------------------- menu

  function open() {
    menu.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    items.find((item) => item.dataset.themeOption === mode).focus();
  }

  function close({ focus = false } = {}) {
    if (menu.hidden) return;
    menu.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    if (focus) btn.focus();
  }

  btn.addEventListener('click', () => (menu.hidden ? open() : close()));
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); open(); }
  });

  menu.addEventListener('click', (e) => {
    const item = e.target.closest('[data-theme-option]');
    if (!item) return;
    set(item.dataset.themeOption);
    close({ focus: true });
  });
  menu.addEventListener('keydown', (e) => {
    const i = items.indexOf(document.activeElement);
    const to = { ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: items.length - 1 }[e.key];
    if (to !== undefined) { e.preventDefault(); items[(to + items.length) % items.length].focus(); }
    if (e.key === 'Escape') { e.preventDefault(); close({ focus: true }); }
    if (e.key === 'Tab') close();
  });

  document.addEventListener('pointerdown', (e) => { if (!theme.contains(e.target)) close(); });
  theme.addEventListener('focusout', (e) => { if (e.relatedTarget && !theme.contains(e.relatedTarget)) close(); });

  // Keep other tabs in step when the choice changes there.
  window.addEventListener('storage', (e) => {
    if (e.key !== KEY && e.key !== null) return;
    mode = read();
    applyAttr(mode);
    sync();
  });

  sync();
  theme.hidden = false;
})();
