# Button Config Field Design

## Goal

Add a settings field that lets users choose which toolbar buttons are visible and reorder them.

## Scope

- 9 configurable buttons: DL file, DL list zip, Copy link, Copy all links, Copy list link, Aria2 (file), Aria2 (list), Aria2 (zip), Show links
- Settings button is always visible, not configurable
- All buttons enabled by default, in current CONFIG.buttons order
- No minimum visible buttons (user can hide all 9 if they want)

## Data Model

```ts
interface ButtonConfigItem {
  id: string;       // Button text from CONFIG.buttons (e.g. "DL file")
  visible: boolean;
}

type ButtonConfig = ButtonConfigItem[];
```

Stored as a single GM_getValue key `"buttonConfig"`. Default is generated from CONFIG.buttons with all `visible: true`.

## UI

Separate section "Toolbar buttons" in the settings modal. Each row:

```
[Toggle] [Icon glyph] [Button name] [↑] [↓]
```

- Toggle shows/hides the button
- Up/down arrows reorder (swap with adjacent item)
- First item: up arrow disabled. Last item: down arrow disabled
- Changes persist immediately via setSetting()

## Files

| File | Change |
|------|--------|
| `src/settings/index.ts` | Add `buttonConfig` to FieldDeclarations, generate default from CONFIG.buttons |
| `src/ui/button-config.ts` | New component: toggle + icon + name + arrows list |
| `src/ui/settings-modal.ts` | Add `"buttonConfig"` case in field type switch |
| `src/index.ts` | Read buttonConfig to filter/order buttons in toolbar rendering |
| `src/style.css` | Styles for the button config list |

## Rendering Flow

1. `onLoaded()` reads `buttonConfig` from storage
2. If no config saved, falls back to CONFIG.buttons (all visible, default order)
3. For each item where `visible === true`, creates toolbar button at that position
4. Settings modal reads config to populate toggle states and order

## Edge Cases

- First access: all buttons visible, default order
- Show links hidden: modal still opens via popovertarget (no action dependency)
- All hidden: toolbar shows only Settings
- Future button ID changes: orphaned items silently ignored
