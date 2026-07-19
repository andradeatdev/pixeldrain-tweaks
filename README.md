# Pixeldrain Tweaks

> Feedback and feature ideas: [Comments tab](https://greasyfork.org/scripts/551561/feedback)

Enhances Pixeldrain with direct download buttons, proxy bypass, and a settings modal.

---

## Features

- **Direct Downloads** — toolbar buttons for instant downloads, no intermediate page.
- **Proxy Bypass** — uses `cdn.pixeldrain.eu.cc` by default. Customizable in settings.
- **Single & Multi-file** — works on individual files and folders.

---

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
2. [Install script](https://greasyfork.org/scripts/551561).
3. Open any Pixeldrain file or list page — buttons appear in the toolbar.

---

## Toolbar

| Button | Action |
|---|---|
| DL file | Downloads current file |
| DL list zip | Downloads list as ZIP |
| Copy file | Copies file link |
| Copy all files | Copies all file links |
| Copy list zip | Copies ZIP download link |
| Show URLs | Shows proxy URLs in a modal |
| Settings | Opens settings modal |

---

## Settings

| Field | Type | Description |
|---|---|---|
| Custom proxy URLs | textarea | One URL per line. Randomly selected per request. |
| Force view video | toggle | Force video playback even when not logged in. |

---

## JDownloader

JDownloader monitors the clipboard automatically. Clicking any **Copy** button adds the link to LinkGrabber — no extra setup needed.

---

## Acknowledgements

- [Game Drive](https://greasyfork.org/users/1290286-game-drive) — proxy hosting.
- Inspired by **hhoneeyy** and **MegaLime0**'s Pixeldrain Bypass scripts.

---

## License

GPL-3.0-only
