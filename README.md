# VS Code website footer

> **Branch `theme-switcher`: exploration, not the handoff.** This branch adds a System / Light / Dark theme switcher to the footer and compares seven ways to show it. Open `index.html` to see them. The handoff the builder uses is on `main`.

## Theme switcher options (this branch)

The bottom line on desktop becomes Your Privacy Choices on the left, the license agreement in the centre and the theme switcher on the right. Consumer Health Privacy moves into the Legal column on desktop; on mobile it stays an always-visible row. On mobile the switcher is the last row.

| # | Option | What it is |
| --- | --- | --- |
| 1 | Icon pill | System, Light and Dark icons in a rounded track (the mockup) |
| 2 | Labeled pill | The same track with a word next to each icon |
| 3 | Dark mode switch | One on/off switch; no way back to System once set |
| 4 | Cycle button | One button that steps System → Light → Dark |
| 5 | Select menu | A native select labelled Theme |
| 6 | Text options | "Theme: System · Light · Dark" in the small print |
| 7 | Appearance swatches | Three small theme previews, like an OS setting |

How it works: `theme.js` saves the choice in `localStorage` (`vscode-theme`) and sets `data-theme="light"` or `"dark"` on `<html>`; System removes the attribute so the OS decides. A one-line script in `<head>` applies a saved choice before first paint. Changes sync across tabs. `footer.html?v=1` to `?v=7` picks the option; once the team chooses one, its markup goes into `footer.html` and the rest is removed.

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
index.html    preview page (desktop and mobile frames); not part of the footer
images/       reference renders of the new footer, and a screenshot of the current one
AGENTS.md     instructions for replacing the current footer on the site
```

`footer.html` and `footer.css` are the whole footer. It needs no JavaScript.

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
