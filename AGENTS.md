# Agent instructions: replace the VS Code website footer

Your task is to replace the footer on the VS Code website (code.visualstudio.com) with the footer in this repository. Work in the website's codebase. Use this repository as the reference.

## What is in this repository

| File | Use |
| --- | --- |
| `footer.html` | The new footer markup. Copy only the `<footer>` element between the `FOOTER START` and `FOOTER END` comments. The rest of the file is a demo page. |
| `footer.css` | Every style the footer needs: colour tokens, desktop layout, and mobile layout (`@media (max-width: 760px)`). |
| `images/desktop.png`, `images/mobile.png` | How the result must look in the light theme, at 1280 px and 390 px. |
| `images/desktop-dark.png`, `images/mobile-dark.png` | The same in the dark theme. |
| `images/current-footer.png` | The footer you are replacing, so you can recognise it. |

The footer needs no JavaScript. The mobile groups are native `<details>` / `<summary>` elements.

## Steps

### 1. Find the current footer

The footer appears on every page, so it is most likely in a shared layout, template, partial or component. Search the codebase for strings it contains:

- `yourcaliforniaprivacychoices`
- `Consumer Health Privacy` or `linkid=2259814`
- `By using VS Code, you agree`
- `vscodepodcast`

Read the whole footer before you change anything, including its styles, any scripts it loads, and how the template builds it. Compare it with `images/current-footer.png`.

### 2. Record what the current footer wires up

Before you remove anything, list the behaviour the current footer has beyond plain links, and carry it over to the matching link in the new footer:

- **Your Privacy Choices.** On Microsoft sites this link is often wired to the cookie consent manager, through an `onclick`, an `id`, a `data-*` attribute or a script that finds it. Keep that wiring on the new link. The opt-out must keep working exactly as it does today.
- **Conditional items.** If the current footer shows items only in some regions or states, such as a "Manage cookies" link for visitors in the EU, keep them. Put them in the Legal group and on the desktop bottom line next to Your Privacy Choices, and keep them always visible on mobile, like the other privacy rows.
- **Analytics and telemetry.** Keep any tracking attributes (for example `data-*`, `aria-*` or event hooks) that the current links carry.
- **URLs.** Where the current footer and `footer.html` link to the same destination with a different URL, use the current footer's URL. The social links in `footer.html` were written by hand. `/License` is a site-relative path; confirm the route exists.

### 3. Replace the markup

Replace the current footer with the markup from `footer.html`:

- Translate it into the site's template language or component format if needed. Keep the element structure, class names and order.
- Keep both link blocks. `.ft-desk` is shown on desktop and `.ft-mob` on mobile; CSS hides the other one. Do not merge them, and keep their links identical.
- The column headings are `<h3>`. If that breaks the page's heading outline, change the level (for example to `<h2>`). The styles target the `.ft-h` class, so the look does not change.
- If the links are generated from data (a config file or CMS), generate the new groups from the same data instead of hard-coding them.

### 4. Add the styles

- Add `footer.css` to the site's stylesheet pipeline the way other component styles are added.
- Remove the current footer's styles, but only rules that nothing else on the site uses. Search before deleting.
- Every class starts with `ft-` and every rule is scoped under `.ft`. Search the site for existing `ft-` classes and `--ft-` custom properties. If any collide, rename the footer's prefix consistently in both files.
- **Theme.** Dark values follow `prefers-color-scheme`, and `data-theme="light"` / `data-theme="dark"` on `<html>` overrides it. If the site switches themes another way (a class on `<html>` or `<body>`, or its own colour variables), change those selectors to match the site's mechanism. Keep the colour values.
- **Font.** If the site defines its own font stack, point `--ft-sans` at it.
- **Breakpoint.** The layout switches at 760 px. If the site has a standard breakpoint close to that, you may use it. Check that the desktop columns still fit at the narrowest desktop width.

### 5. Do not change

- Your Privacy Choices and Consumer Health Privacy stay visible at every width. On mobile they are separate rows below the groups, never inside a collapsed group.
- The Your Privacy Choices icon keeps its official artwork and colours (`--pc-blue`, `--pc-light`) in both themes.
- The license agreement line is shown on desktop and hidden on mobile. This was decided on purpose, not by mistake.
- The groups, their order and the links inside them, unless step 2 adds an item.

## Check your work

Run the site locally and check each item:

- [ ] At 1280 px, the footer matches `images/desktop.png`: logo on the left, four columns on the right, and Consumer Health Privacy, the agreement and Your Privacy Choices on one line at the bottom.
- [ ] At 390 px, it matches `images/mobile.png`: logo, four collapsed groups, then the Consumer Health Privacy and Your Privacy Choices rows. There is no agreement line.
- [ ] At widths between 761 px and 1024 px, the desktop columns do not overlap the logo or wrap badly.
- [ ] At 320 px, there is no horizontal scrolling.
- [ ] Each mobile group opens and closes with a click, a tap, and Enter or Space. Its chevron turns.
- [ ] You can reach every link with Tab, and the focus ring is visible.
- [ ] In the dark theme, it matches `images/desktop-dark.png` and `images/mobile-dark.png`.
- [ ] Your Privacy Choices still opens the consent experience it opened before, if it opened one.
- [ ] Every link goes to the same place as before, or to its new destination in `footer.html`.
- [ ] No old footer markup, styles or scripts remain, and nothing else on the site broke.
- [ ] The browser console shows no new errors.

## When you are done

Summarise for the reviewer:

- which files you changed
- any URL or wiring you carried over from the old footer (step 2)
- any deviation from this repository, and why
- anything you could not verify
