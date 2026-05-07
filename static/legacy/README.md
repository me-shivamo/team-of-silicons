# legacy landing-page partials

these are the original landing-page sections (header / pricing / security / footer). they were removed from `index.html` in the v2 funnel-only landing per Shivam, May 2026. to restore any, paste the file's contents back into `index.html` at the appropriate spot.

## files

- `header.html` — top nav, drops in immediately after `<body>` (above `<main>`).
- `pricing.html` — `#pricing` section, drops inside `<main>` after the funnel.
- `security.html` — `#security` section, drops inside `<main>` after pricing.
- `footer.html` — site footer, drops in just before `</body>`.

the matching CSS for these sections still lives in `static/css/style.css` (intentionally not pruned), so pasting the markup back in will render correctly with no other changes needed.
