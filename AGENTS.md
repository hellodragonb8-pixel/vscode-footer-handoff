# Agent instructions: replace the VS Code website footer

Your task is to replace the footer on the VS Code website (code.visualstudio.com) with the footer in this repository. Work in the website's codebase. Use this repository as the reference.

The new footer includes a **theme menu** (System, Light, Dark) in its bottom-right corner. The menu sets the theme for the whole site, not only the footer.

**Requirement: the footer's background colour and text colour must match the existing website.** The colours in `footer.css` are placeholders from the design mockups. You will look up the site's real colours in step 2 and apply them in step 6.

## What is in this repository

| File | Use |
| --- | --- |
| `footer.html` | The new footer markup. Copy only the `<footer>` element between the `FOOTER START` and `FOOTER END` comments. The one-line `<script>` in its `<head>` is also part of the footer (step 5). The rest of the file is a demo page. |
| `footer.css` | Every style the footer needs: colour and font tokens (light and dark), desktop layout, mobile layout (`@media (max-width: 760px)`) and the theme menu. |
| `theme.js` | The theme menu: saves the choice, applies it to the page, and runs the menu. |
| `images/desktop.png`, `images/mobile.png` | The layout to match, at 1280 px and 390 px. The colours in these images are placeholders; use the site's colours (steps 2 and 6). |
| `images/theme-menu-desktop.png`, `images/theme-menu-mobile.png` | The same with the theme menu open. |
| `images/current-footer.png` | The footer you are replacing, so you can recognise it. |

Only the theme menu needs JavaScript. The mobile link groups are native `<details>` / `<summary>` elements.

## How the theme menu works

- The choice is saved in `localStorage` under the key `vscode-theme`, as `light` or `dark`. System is the default and saves nothing.
- Light and Dark set `data-theme="light"` or `data-theme="dark"` on `<html>`. System removes the attribute, so the visitor's OS setting (`prefers-color-scheme`) decides.
- A one-line script in `<head>` applies a saved choice before the page paints, so a visitor who chose Dark never sees a light flash.
- The menu follows the WAI-ARIA menu button pattern. Enter, Space or an arrow key opens it; the arrows and Home/End move; Enter picks; Escape closes it and returns focus to the button. A click elsewhere also closes it.
- When the choice changes in one tab, other open tabs follow.
- Without JavaScript, the menu stays hidden.

## Steps

### 1. Find the current footer

The footer appears on every page, so it is most likely in a shared layout, template, partial or component. Search the codebase for strings it contains:

- `yourcaliforniaprivacychoices`
- `Consumer Health Privacy` or `linkid=2259814`
- `By using VS Code, you agree`
- `vscodepodcast`

Read the whole footer before you change anything, including its styles, any scripts it loads, and how the template builds it. Compare it with `images/current-footer.png`.

### 2. Record the site's colours and theme setup

Do this before you change anything, while the current footer is still on the page. Run the site locally, open a page, and record the computed values (from the browser's developer tools or `getComputedStyle`) for:

- the current footer's **background colour**
- the current footer's **text colour**, for its main text and for its links
- the current footer's **font family**

Then find where each value comes from in the code: a CSS variable, a design token, a Sass variable or a hard-coded value. Write down both the value and its source. You will apply them in step 6 and compare against them at the end.

If the footer has no background of its own, use the page background behind it. If the site's colours differ by page, use the values from the home page and note the difference in your summary.

Also find out how the site handles themes today:

- Does it already have dark styles or a dark palette? If so, record the dark background and text colours too, and how dark mode is switched on (an attribute or class on `<html>` or `<body>`, a media query, or both).
- Does anything else on the site already offer a theme choice, such as a theme menu in the navigation? If so, record how it stores the choice (storage key and values) and how it applies it.

### 3. Record what the current footer wires up

Before you remove anything, list the behaviour the current footer has beyond plain links, and carry it over to the matching link in the new footer:

- **Your Privacy Choices.** On Microsoft sites this link is often wired to the cookie consent manager, through an `onclick`, an `id`, a `data-*` attribute or a script that finds it. Keep that wiring on the new link. The opt-out must keep working exactly as it does today.
- **Conditional items.** If the current footer shows items only in some regions or states, such as a "Manage cookies" link for visitors in the EU, keep them. Put them in the Legal group and on the desktop bottom line next to Your Privacy Choices, and keep them always visible on mobile, like the other privacy rows.
- **Analytics and telemetry.** Keep any tracking attributes (for example `data-*`, `aria-*` or event hooks) that the current links carry.
- **URLs.** Where the current footer and `footer.html` link to the same destination with a different URL, use the current footer's URL. The social links in `footer.html` were written by hand. `/License` is a site-relative path; confirm the route exists.

### 4. Replace the markup

Replace the current footer with the markup from `footer.html`:

- Translate it into the site's template language or component format if needed. Keep the element structure, class names, attributes and order.
- Keep both link blocks. `.ft-desk` is shown on desktop and `.ft-mob` on mobile; CSS hides the other one. Do not merge them. They differ on purpose in one place: on desktop, Consumer Health Privacy is in the Legal column; on mobile it is its own row under the groups.
- Keep the theme menu markup (`.ft-theme`) exactly, including the `hidden` attributes, `role`, `aria-*` and `data-theme-option` attributes. `theme.js` depends on them.
- The column headings are `<h3>`. If that breaks the page's heading outline, change the level (for example to `<h2>`). The styles target the `.ft-h` class, so the look does not change.
- If the links are generated from data (a config file or CMS), generate the new groups from the same data instead of hard-coding them.

### 5. Add the theme script

- Put the one-line script from the `<head>` of `footer.html` into the `<head>` of every page, before any stylesheet, so it runs before the page paints.
- Load `theme.js` on every page, after the footer markup or with `defer`, the way the site loads its other scripts.
- **If the site already has a theme choice** (step 2), the footer menu and the existing control must share one setting: use the same storage key, values and attribute in `theme.js`, the `<head>` script and the dark selectors in `footer.css`. A change in one control must show in the other, including on the same page.
- **If the site already switches dark mode another way** (for example a class on `<body>`), change `applyAttr` in `theme.js`, the `<head>` script and the dark selectors in `footer.css` to that mechanism, consistently.

### 6. Add the styles

- Add `footer.css` to the site's stylesheet pipeline the way other component styles are added.
- Remove the current footer's styles, but only rules that nothing else on the site uses. Search before deleting.
- Every class starts with `ft-` and every rule is scoped under `.ft`. Search the site for existing `ft-` classes and `--ft-` custom properties. If any collide, rename the footer's prefix consistently in `footer.html`, `footer.css` and `theme.js`.
- **Colours and font.** Apply the values you recorded in step 2 by setting the tokens at the top of `footer.css`. Reference the site's own variable or token wherever one exists, so the footer follows the site if its colours change; copy the value only when there is none.
  - `--ft-bg`: **required.** The footer background from step 2.
  - `--ft-ink`: **required.** The footer text colour from step 2. Used for headings, the wordmark and the mobile rows.
  - `--ft-ink-soft`, `--ft-muted`: the current footer's link and secondary text colours from step 2
  - `--ft-accent`, `--ft-focus`: the site's link hover and focus colours
  - `--ft-rule`, `--ft-rule-strong`: the site's divider and border colours
  - `--ft-ctl-bg`, `--ft-ctl-on`, `--ft-ctl-ink`, `--ft-ctl-ink-on`, `--ft-menu-bg`: the theme button and menu. Use the site's control or button colours if it has them, otherwise keep these values.
  - `--ft-sans`: the site's font stack

  Keep the sizes, weights and spacing from `footer.css`; only the colours and font family change. Check that text still meets WCAG AA contrast (4.5:1) against the new background.
- **Dark colours.** The dark blocks in `footer.css` set the same tokens for the dark theme. If the site has a dark palette (step 2), map each token to its dark value. If it does not, keep the values in `footer.css` and say so in your summary.
- **Breakpoint.** The layout switches at 760 px. If the site has a standard breakpoint close to that, you may use it. Check that the desktop columns still fit at the narrowest desktop width.

### 7. Do not change

- Your Privacy Choices and Consumer Health Privacy stay visible at every width. On mobile they are separate rows below the groups, never inside a collapsed group.
- The Your Privacy Choices icon keeps its official artwork and colours (`--pc-blue`, `--pc-light`) in both themes. Do not map these to site colours.
- The license agreement line is shown on desktop and hidden on mobile. This was decided on purpose, not by mistake.
- The groups, their order and the links inside them, unless step 3 adds an item. The Legal column reads Privacy, Consumer Health Privacy, Terms of Use.
- The theme menu: three options (System, Light, Dark) with System as the default; on desktop at the right end of the bottom line, on mobile as the last row with the button on the left; the menu opens upward.

### 8. If the rest of the site has no dark styles

The theme menu switches `data-theme` on `<html>`, and the footer responds. If the rest of the site has no dark styles yet, only the footer will change when a visitor picks Dark. Do not build a dark theme for the rest of the site as part of this task. Say clearly in your summary that the site needs dark styles before the menu is useful, and list where the site's main colours are defined.

## Check your work

Run the site locally and check each item:

**Layout**

- [ ] At 1280 px, the layout matches `images/desktop.png`: logo on the left, four columns on the right, and Your Privacy Choices, the agreement and the theme button on one line at the bottom.
- [ ] At 390 px, the layout matches `images/mobile.png`: logo, four collapsed groups, then the Consumer Health Privacy and Your Privacy Choices rows, then the theme button on the left. There is no agreement line.
- [ ] At widths between 761 px and 1024 px, the desktop columns do not overlap the logo or wrap badly.
- [ ] At 320 px, there is no horizontal scrolling, and the open theme menu stays on screen.

**Behaviour**

- [ ] Each mobile group opens and closes with a click, a tap, and Enter or Space. Its chevron turns.
- [ ] You can reach every link and the theme button with Tab, and the focus ring is visible.
- [ ] The theme menu opens upward, as in `images/theme-menu-desktop.png` and `images/theme-menu-mobile.png`, with a check next to the current theme.
- [ ] Picking Light or Dark changes the theme at once, and the button shows the new choice. Picking System follows the OS setting.
- [ ] After a reload, the saved choice is still applied, with no flash of the other theme.
- [ ] The menu works with the keyboard: arrows, Home/End, Enter, and Escape (which returns focus to the button). A click elsewhere closes it.
- [ ] If the site already had a theme control, it and the footer menu stay in sync.

**Colours and content**

- [ ] The footer's computed background colour and text colour are the same as the values you recorded in step 2.
- [ ] Link colours and the font match the rest of the site, and all text meets WCAG AA contrast in both themes.
- [ ] Your Privacy Choices still opens the consent experience it opened before, if it opened one.
- [ ] Every link goes to the same place as before, or to its new destination in `footer.html`.
- [ ] No old footer markup, styles or scripts remain, and nothing else on the site broke.
- [ ] The browser console shows no new errors.

## When you are done

Summarise for the reviewer:

- which files you changed
- the background colour, text colour and font you recorded in step 2, with their sources in the code, and which token each one went into
- how the site handled themes before (step 2), and how you connected the theme menu to it (step 5)
- whether the rest of the site has dark styles (step 8)
- any URL or wiring you carried over from the old footer (step 3)
- any deviation from this repository, and why
- anything you could not verify
