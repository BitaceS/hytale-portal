# Hytale Portal

Lightweight landing page for Hytale servers (HTML, CSS, JavaScript)

A ready-to-use landing page designed specifically for **Hytale servers**.
No framework, no build tools, no backend — just upload and use.

Perfect for server owners who want a **fast, simple, and customizable Hytale server website** without technical setup.

---

## 🌐 Live Demo

[https://hyportal.bitaces.dev](https://hyportal.bitaces.dev)

---

## ⭐ Features

* Live Hytale server status and player count
* In-browser configuration panel
* Customizable title, colors, background, and links
* Multiple icon styles (Default, Fantasy, Pixel)
* Multi-language support (EN, DE, ES)
* No Node.js, npm, or build step required
* Pure HTML, CSS, and JavaScript
* Editable texts directly from the panel
* Custom icons can be added or replaced manually

---

## 🎯 Use Cases

* Hytale survival or RPG servers
* Community hubs
* Server launch pages
* Discord-first communities
* Lightweight server websites

---

## 🚀 Quick Start

* Open `index.html` in your browser, or
* Start a local server and open:

```
http://localhost:8000
```

---

## ⚙️ What You Need to Know

* Set your server address in the config panel (e.g. `play.yourserver.gg`).
* Live status is fetched automatically from the built-in status API.
* You can change:

  * language
  * colors
  * links
  * icon packs
  * all visible text
* Layout and texts can be fully customized without editing code.

---

## 🔐 Owner Mode (Lock / Unlock Config Panel)

By default, visitors do not see the config panel.
Only the owner can open it using the owner key.

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

* Keyboard: `Ctrl + Shift + O` (Windows/Linux)
* Keyboard: `Cmd + Shift + O` (Mac)
  Then enter the owner key.

Or open:

```
https://your-domain.com/?owner=1&ownerKey=your-secret-key
```

### Lock the panel again

Open:

```
https://your-domain.com/?owner=0
```

---

## 🌐 Languages

Language files are located in `lang/`:

* `en.json`
* `de.json`
* `es.json`

You can:

* Edit them directly, or
* Use the Language Editor in the panel to override texts.

---

## 📡 Server Status

The portal uses a built-in status API:

```
https://api.bitaces.dev/status.php
```

* No setup required.
* Just enter your server address.
* If the API or server is unreachable, it will show:

```
Offline / 0 players
```

---

## 📁 File Structure

```
/
  .gitignore
  LICENSE
  README.md
  index.html

  css/
    styles.css

  js/
    app.js
    owner-config.js

  lang/
    de.json
    en.json
    es.json

  assets/
    favicon.svg
    manifest.json

    backgrounds/
      bg-day.jpg
      bg-night.jpg
      bg-twilight.jpg

    icons/
      default/
        default-1.png … default-6.png
      fantasy/
        fantasy-1.png … fantasy-6.png
      pixel/
        pixel-1.png … pixel-6.png

    ui/
      panel-logo-default.png
```

---

## 🔗 Links

**Demo:**
[https://hyportal.bitaces.dev](https://hyportal.bitaces.dev)

**Support & Feature Requests:**
[https://discord.gg/MM23whMgT6](https://discord.gg/MM23whMgT6)

**Resource Page:**
[https://hytaletalk.com/resources/hytale-portal-landing-page.2/](https://hytaletalk.com/resources/hytale-portal-landing-page.2/)

**GitHub Source:**
[https://github.com/BitaceS/hytale-portal](https://github.com/BitaceS/hytale-portal)

---

## ⚠️ Notes

* Owner protection is a front-end convenience only.
* It is not real server-side security.
* For anything sensitive, always secure it on the server.
* Status depends on the external API.

---

## 🚀 Quick Summary

Upload files → unlock panel → enter server address → save.
**Done in under a minute.**
