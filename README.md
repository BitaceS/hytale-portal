# Hytale Portal

Lightweight landing page for Hytale servers. Plain HTML, CSS, and JavaScript — no build step.

**Demo:** [https://hyportal.bitaces.dev](https://hyportal.bitaces.dev)

For feature requests and support, join our Discord: [https://discord.gg/MM23whMgT6](https://discord.gg/MM23whMgT6)

## Quick start

- Open `index.html` in your browser, or
- Run a local server, e.g. `python3 -m http.server`, then open `http://localhost:8000`

## What you need to know

- Set your server address in the config panel (e.g. `play.yourserver.gg`).
- Live status is fetched automatically from the built-in status API.
- You can change language, colors, links, and all visible text in the panel.

## Owner mode (lock / unlock config panel)

By default, visitors do not see the config panel. Only you can open it with the owner key.

### Change the owner key

Edit `js/owner-config.js`:

```js
window.PORTAL_OWNER_CONFIG = {
  key: "your-secret-key",
  queryParam: "ownerKey",
  shortcut: true
};
```

### Unlock the panel

- Keyboard: `Ctrl + Shift + O` (Windows/Linux) or `Cmd + Shift + O` (Mac), then enter the key.
- Or open: `https://your-domain.com/?owner=1&ownerKey=your-secret-key`

### Lock the panel again

Open: `https://your-domain.com/?owner=0`

## Languages

Language files in `lang/`:

- `en.json`
- `de.json`
- `es.json`

Edit them directly or use the Language Editor tab in the panel to override strings.

## Notes

- Owner protection is a front-end convenience only, not real server-side security.
- For anything sensitive, always secure it on the server.
