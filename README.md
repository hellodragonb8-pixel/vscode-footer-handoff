# VS Code website footer

> **Branch `theme-switcher`: work in progress, not the handoff yet.** This branch adds a theme menu (System, Light, Dark) to the footer. The handoff the builder uses is on `main`.

## Theme menu (this branch)

- **Desktop bottom line:** Your Privacy Choices on the left, the license agreement in the centre, the theme menu on the right.
- **Legal column (desktop):** Privacy, Consumer Health Privacy, Terms of Use. On mobile, Consumer Health Privacy stays an always-visible row.
- **Mobile:** the theme menu is the last row, labelled Theme.
- **The menu:** a button shows the current theme. Clicking it opens a menu above it with System, Light and Dark, the current one checked. It works with the keyboard (arrows, Home/End, Enter, Escape) and closes on a click elsewhere.
- **How it works:** `theme.js` saves the choice in `localStorage` (`vscode-theme`) and sets `data-theme="light"` or `"dark"` on `<html>`; System removes the attribute so the OS decides. A one-line script in `<head>` applies a saved choice before first paint. Changes sync across tabs. Without JavaScript the menu stays hidden.

The new footer for the VS Code website (code.visualstudio.com), ready to replace the current one. It has a desktop layout and a mobile layout, and takes on the site's own colours and type.

**Replacing the footer with a coding agent?** Point the agent at [AGENTS.md](AGENTS.md). It has step-by-step instructions and a checklist.

| Desktop | Mobile |
| --- | --- |
| ![Footer at desktop width](images/desktop.png) | ![Footer at mobile width](images/mobile.png) |

The footer it replaces: [current footer](images/current-footer.png).

## Viewing

Open `index.html` in a browser. It shows the footer at 1280 px and at 390 px side by side. No build step or server is needed. Open `footer.html` on its own and resize the window to see the layout switch at 760 px.

## Files

```
footer.html   the footer markup, between FOOTER START / FOOTER END comments
footer.css    all footer styles: colour and font tokens, desktop layout, mobile layout
theme.js      the theme menu: saves the choice and applies it
index.html    preview page (desktop and mobile frames); not part of the footer
images/       reference renders of the new footer, and a screenshot of the current one
AGENTS.md     instructions for replacing the current footer on the site
```

`footer.html`, `footer.css` and `theme.js` are the whole footer. Only the theme menu needs JavaScript.

## Design

**Desktop (wider than 760 px)**

- The Microsoft logo and wordmark sit on the left.
- Four link columns sit toward the right, each 150 px wide:
  - **Community:** GitHub, Reddit, X, Bluesky, LinkedIn
  - **Watch & listen:** YouTube, Podcast, TikTok, Instagram
  - **Legal:** Privacy, Terms of Use
  - **Help:** Support, License
- One line runs along the bottom, 112 px below the columns:
  - **Consumer Health Privacy** on the left, under the logo
  - the license agreement ("By using VS Code, you agree to its license and privacy statement.") centred
  - **Your Privacy Choices** with its official icon on the right

**Mobile (760 px and narrower)**

- The logo comes first.
- The four groups become expandable rows, separated by thin rules. They use native `<details>` / `<summary>` elements, so no script is needed.
- **Consumer Health Privacy** and **Your Privacy Choices** follow as their own rows. They are always visible, never inside a collapsed group.
- The license agreement line is not shown on mobile.

**Type and colour**

- The footer's background colour and text colour must match the existing website, and it uses the site's font. The agent reads these from the site when it builds the footer (see AGENTS.md, step 2).
- Every colour and the font are tokens at the top of `footer.css`. The values there match the mockups and the images in this repo; when the footer goes into the site, they are replaced with the site's own values.
- Sizes are part of the design: column headings are 13 px semibold, links are 13 px on desktop and 14 px inside the mobile groups, and small print is 12 px.
- The Your Privacy Choices icon keeps its official blue and white.

## Before shipping

- **Privacy links stay visible.** Your Privacy Choices (California's CCPA opt-out) and Consumer Health Privacy (Washington's My Health My Data Act) must stay visible on every page and at every width. Keep the official Your Privacy Choices icon unchanged.
- **Agreement line on mobile.** The license agreement line is hidden on mobile by design. Confirm that with Microsoft privacy or legal before launch.
- **Social links.** Check the social URLs against the live footer. Some were written by hand.
