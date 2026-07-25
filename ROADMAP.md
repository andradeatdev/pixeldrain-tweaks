# Roadmap — Refactoring Candidates

Architectural review generated 2025-07-24. Candidates ordered by recommendation priority.

---

## 1. ~~Unify the Aria2 dispatch~~ ✅

**Strength:** Strong | **Category:** in-process
**Files:** `src/file/index.ts`

### Problem

`sendFileToAria2()` and `sendListToAria2()` are 25-line near-identical functions. The RPC payload construction, the `GM_xmlhttpRequest` call, the error handling — all duplicated. Only the URL differs.

### Solution

Extract a `sendToAria2(url)` module that owns the RPC payload and HTTP call. Callers become one-liners.

### Benefits

- **Locality:** RPC logic concentrated in one module
- **Leverage:** new Aria2 targets (batch download, etc.) need one function
- **Deletion test:** deleting either caller leaves the other broken — proof the shared logic is real

---

## 2. ~~Consolidate URL construction~~ ✅

**Strength:** Strong | **Category:** in-process
**Files:** `src/file/url-builder.ts`, `src/file/index.ts`

### Problem

URL construction lived in two places: `url-builder.ts` (for downloads and bulk links) and inline in `copyFileLink()` / `copyListLink()`. Query parameters differed subtly (`?download=` vs `?filename=`) with no clear reason for the inconsistency.

### Solution

All proxy URL construction now lives in `url-builder.ts`. New functions `getFileCopyURL()`, `getListCopyURL()`, `getFileRawURL()`, `getListRawURL()` with explicit naming. Action functions in `file/index.ts` are pure delegators.

### Benefits

- **Locality:** all URL shape decisions in one module
- **Leverage:** changing proxy URL format requires one edit
- **Deletion test:** deleting url-builder.ts forces inline URL logic to reappear in 4+ callers

---

## 3. ~~Deepen the viewer_data accessor~~ ✅

**Strength:** Worth exploring | **Category:** in-process
**Files:** `src/file/viewer-data.ts`

### Problem

Every public function in `viewer-data.ts` independently read `$window.viewer_data`, null-checked it, and branched on `type`. The guard and type-dispatch were copy-pasted across three accessors.

### Solution

A private `getViewerData()` now owns the null-guard and throw. Public functions call it and handle only their specific extraction logic.

### Benefits

- **Locality:** "viewer_data can be null" fact lives in one place
- **Leverage:** adding a new accessor becomes trivial

---

## 4. ~~Make the Show URLs modal reactive~~ ✅

**Strength:** Worth exploring | **Category:** in-process
**Files:** `src/ui/show-urls-modal.ts`

### Problem

The modal read URLs at creation time. Since Pixeldrain is an SPA, navigating between pages left the modal showing stale URLs from the previous page.

### Solution

URL computation deferred to the `popovershow` event. Fresh URLs are computed and injected into the textarea just before display.

### Benefits

- **Locality:** URL freshness concern consolidated with the modal lifecycle
- **Leverage:** pattern reusable for any lazy-refreshed popover

---

## 5. ~~Absorb clipboard calls behind a seam~~ ✅

**Strength:** Speculative | **Category:** ports & adapters
**Files:** `src/file/index.ts`, `src/ui/show-urls-modal.ts`, `src/utils/index.ts`

### Problem

Four independent `$window.navigator.clipboard.writeText()` calls with no error handling. Clipboard API can throw in non-secure contexts or when denied by the user.

### Solution

A `copyToClipboard()` module in `utils/` wraps the clipboard API. Callers delegate. Error handling lives in one place.

### Benefits

- **Locality:** clipboard error handling in one module
- **Leverage:** one adapter to swap for testing or alternative clipboard APIs

---

## 6. ~~Remove vestigial Prettier config~~ ✅

**Strength:** Speculative | **Category:** config
**Files:** `.prettierrc`, `biome.json`

### Problem

`.prettierrc` (single quotes, 140 width) contradicted `biome.json` (double quotes, 120 width). Source code matched Biome. Prettier was vestigial — not in devDependencies, no scripts using it.

### Solution

Deleted `.prettierrc`.

### Benefits

- **Deletion test:** the file could be deleted without consequence — proves it's noise

---

## Execution Order

1. ~~**Aria2 dispatch**~~ ✅ — smallest diff, highest signal. Establishes the extract-and-delegate pattern.
2. ~~**URL construction**~~ ✅ — carries the same momentum. Fixes the subtle `?download=` / `?filename=` inconsistency.
3. ~~**viewer_data accessor**~~ ✅ — reduces repetition, makes adding new accessors trivial.
4. ~~**Show URLs modal**~~ ✅ — fixes a user-visible bug (stale data).
5. ~~**Clipboard seam**~~ ✅ — defensive; adds error handling where none exists.
6. ~~**Prettier cleanup**~~ ✅ — zero-risk config hygiene.
