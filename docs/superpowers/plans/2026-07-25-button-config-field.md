# Button Config Field Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a settings field that lets users choose which toolbar buttons are visible and reorder them via up/down arrows.

**Architecture:** A new `buttonConfig` setting stores a serialized array of `{id, visible}` items. A new `createButtonConfigField()` UI component renders toggles + reorder arrows. The toolbar rendering reads this config to filter and order buttons.

**Tech Stack:** TypeScript, vanilla DOM, Greasemonkey/Tampermonkey GM_* APIs, CSS (existing patterns)

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/settings/index.ts` | Modify | Add `ButtonConfigItem` type, `buttonConfig` field definition, default generator |
| `src/ui/button-config.ts` | Create | New UI component: toggle + icon + name + up/down arrows list |
| `src/ui/index.ts` | Modify | Export `createButtonConfigField` |
| `src/ui/settings-modal.ts` | Modify | Add `"buttonConfig"` case in field type switch |
| `src/index.ts` | Modify | Read `buttonConfig` to filter/order toolbar buttons |
| `src/style.css` | Modify | Styles for button config list |

---

### Task 1: Add ButtonConfigItem type and buttonConfig field definition

**Files:**
- Modify: `src/settings/index.ts`

- [ ] **Step 1: Add the ButtonConfigItem interface and default generator**

At the top of `src/settings/index.ts`, after the existing imports, add the type and generator:

```ts
import { CONFIG } from "@/config";

export interface ButtonConfigItem {
	id: string;
	visible: boolean;
}

function generateDefaultButtonConfig(): ButtonConfigItem[] {
	return CONFIG.buttons
		.filter((btn) => btn.text !== "Settings")
		.map((btn) => ({ id: btn.text, visible: true }));
}
```

- [ ] **Step 2: Add buttonConfig to FieldDeclarations**

Inside the `FieldDeclarations` interface, add the new field:

```ts
buttonConfig: {
	type: "buttonConfig";
	label: string;
	description: string;
	default: ButtonConfigItem[];
};
```

- [ ] **Step 3: Add buttonConfig to FIELDS object**

Inside the `FIELDS` object, add:

```ts
buttonConfig: {
	type: "buttonConfig",
	label: "Toolbar buttons",
	description: "Choose which buttons appear and their order",
	default: generateDefaultButtonConfig(),
},
```

- [ ] **Step 4: Build to verify no type errors**

Run: `npx rollup -c`
Expected: Build succeeds, no type errors

- [ ] **Step 5: Commit**

```bash
git add src/settings/index.ts
git commit -m "feat: add buttonConfig setting type and field definition"
```

---

### Task 2: Create the buttonConfig UI component

**Files:**
- Create: `src/ui/button-config.ts`

- [ ] **Step 1: Create the component file**

```ts
import { getIcon } from "./icon";

interface ButtonConfigFieldOptions {
	label: string;
	description?: string;
	defaultValue: { id: string; visible: boolean }[];
	onChange?: (value: { id: string; visible: boolean }[]) => void;
}

export function createButtonConfigField({
	label,
	description,
	defaultValue,
	onChange,
}: ButtonConfigFieldOptions): HTMLDivElement {
	const wrapper = document.createElement("div");
	wrapper.className = "pdt-field pdt-field--card";

	const labelText = document.createElement("span");
	labelText.className = "pdt-field__label";
	labelText.textContent = label;
	wrapper.append(labelText);

	if (description) {
		const descText = document.createElement("span");
		descText.className = "pdt-field__description";
		descText.textContent = description;
		wrapper.append(descText);
	}

	const list = document.createElement("ul");
	list.className = "pdt-button-config__list";
	wrapper.append(list);

	const items = [...defaultValue];

	function render() {
		list.innerHTML = "";
		for (let i = 0; i < items.length; i++) {
			const item = items[i];
			const li = document.createElement("li");
			li.className = "pdt-button-config__item";

			const toggle = document.createElement("input");
			toggle.type = "checkbox";
			toggle.checked = item.visible;
			toggle.className = "pdt-button-config__toggle";
			toggle.addEventListener("change", () => {
				item.visible = toggle.checked;
				onChange?.([...items]);
			});

			const icon = document.createElement("span");
			icon.className = "pdt-button-config__icon";
			icon.innerHTML = getIcon(getIconGlyph(item.id));

			const name = document.createElement("span");
			name.className = "pdt-button-config__name";
			name.textContent = item.id;

			const moveUp = document.createElement("button");
			moveUp.type = "button";
			moveUp.className = "pdt-button-config__arrow";
			moveUp.textContent = "\u25B2";
			moveUp.disabled = i === 0;
			moveUp.addEventListener("click", () => {
				[items[i - 1], items[i]] = [items[i], items[i - 1]];
				onChange?.([...items]);
				render();
			});

			const moveDown = document.createElement("button");
			moveDown.type = "button";
			moveDown.className = "pdt-button-config__arrow";
			moveDown.textContent = "\u25BC";
			moveDown.disabled = i === items.length - 1;
			moveDown.addEventListener("click", () => {
				[items[i], items[i + 1]] = [items[i + 1], items[i]];
				onChange?.([...items]);
				render();
			});

			li.append(toggle, icon, name, moveUp, moveDown);
			list.append(li);
		}
	}

	render();
	return wrapper;
}

function getIconGlyph(id: string): string {
	const glyphs: Record<string, string> = {
		"DL file": "save_alt",
		"DL list zip": "save_alt",
		"Copy link": "content_copy",
		"Copy all links": "copy_all",
		"Copy list link": "folder_copy",
		"Aria2 (file)": "launch",
		"Aria2 (list)": "launch",
		"Aria2 (zip)": "launch",
		"Show links": "link",
	};
	return glyphs[id] ?? "help";
}
```

- [ ] **Step 2: Build to verify no type errors**

Run: `npx rollup -c`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/ui/button-config.ts
git commit -m "feat: add buttonConfig UI component with toggle and reorder arrows"
```

---

### Task 3: Wire up the UI component in settings-modal and exports

**Files:**
- Modify: `src/ui/settings-modal.ts`
- Modify: `src/ui/index.ts`

- [ ] **Step 1: Add import to settings-modal.ts**

Add at the top of `src/ui/settings-modal.ts`:

```ts
import { createButtonConfigField } from "./button-config";
```

- [ ] **Step 2: Add case to the switch in createSettingsModal**

Inside the `switch (field.type)` block, add a new case before the closing `}`:

```ts
case "buttonConfig": {
	const fieldEl = createButtonConfigField({
		label: field.label,
		description: field.description,
		defaultValue: getSetting(key) as { id: string; visible: boolean }[],
		onChange: (v) => setSetting(key, v),
	});
	content.append(fieldEl);
	break;
}
```

- [ ] **Step 3: Add export to ui/index.ts**

Add to `src/ui/index.ts`:

```ts
export { createButtonConfigField } from "./button-config";
```

- [ ] **Step 4: Build to verify no type errors**

Run: `npx rollup -c`
Expected: Build succeeds

- [ ] **Step 5: Commit**

```bash
git add src/ui/settings-modal.ts src/ui/index.ts
git commit -m "feat: wire buttonConfig field into settings modal"
```

---

### Task 4: Update toolbar rendering to respect buttonConfig

**Files:**
- Modify: `src/index.ts`

- [ ] **Step 1: Modify onLoaded to read buttonConfig and filter buttons**

Replace the button rendering loop in `src/index.ts`. The current code (lines 32-40):

```ts
for (const btn of CONFIG.buttons) {
	const item = createToolbarButton(btn.text, getIcon(btn.icon));
	if (btn.action) item.addEventListener("click", () => btn.action());

	for (const [key, value] of Object.entries(btn.attrs ?? {})) {
		item.setAttribute(key, value);
	}
	separator.before(item);
}
```

Replace with:

```ts
const buttonConfig = getSetting("buttonConfig") as { id: string; visible: boolean }[] | undefined;
const configMap = new Map(buttonConfig?.map((c) => [c.id, c.visible]));

const orderedButtons = buttonConfig
	? buttonConfig
			.map((c) => CONFIG.buttons.find((btn) => btn.text === c.id))
			.filter((btn): btn is (typeof CONFIG.buttons)[number] => btn !== undefined)
	: CONFIG.buttons;

for (const btn of orderedButtons) {
	if (configMap.size > 0 && configMap.get(btn.text) === false) continue;

	const item = createToolbarButton(btn.text, getIcon(btn.icon));
	if (btn.action) item.addEventListener("click", () => btn.action());

	for (const [key, value] of Object.entries(btn.attrs ?? {})) {
		item.setAttribute(key, value);
	}
	separator.before(item);
}
```

- [ ] **Step 2: Build to verify no type errors**

Run: `npx rollup -c`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/index.ts
git commit -m "feat: toolbar rendering respects buttonConfig order and visibility"
```

---

### Task 5: Add CSS styles for button config list

**Files:**
- Modify: `src/style.css`

- [ ] **Step 1: Add styles inside the existing @scope (.pdt-popover) block**

Before the closing `}` of the `@scope (.pdt-popover)` block (before the `.pdt-urls__textarea` styles, around line 213), add:

```css
	.pdt-button-config__list {
		list-style: none;
		padding: 0;
		margin: 8px 0 0;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}

	.pdt-button-config__item {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 6px 8px;
		border-radius: 4px;
		transition: background-color 0.15s;
	}

	.pdt-button-config__item:hover {
		background-color: rgba(255, 255, 255, 0.04);
	}

	.pdt-button-config__toggle {
		accent-color: var(--highlight_background);
		width: 14px;
		height: 14px;
		cursor: pointer;
	}

	.pdt-button-config__icon {
		display: flex;
		align-items: center;
		font-size: 18px;
		color: var(--body_text_color);
		width: 20px;
		justify-content: center;
	}

	.pdt-button-config__name {
		flex: 1;
		font-size: 13px;
		color: var(--body_text_color);
	}

	.pdt-button-config__arrow {
		background: none;
		border: 1px solid rgba(255, 255, 255, 0.1);
		border-radius: 4px;
		color: var(--body_text_color);
		font-size: 10px;
		width: 24px;
		height: 24px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0;
		transition: background-color 0.15s, opacity 0.15s;
	}

	.pdt-button-config__arrow:hover:not(:disabled) {
		background-color: rgba(255, 255, 255, 0.08);
	}

	.pdt-button-config__arrow:disabled {
		opacity: 0.3;
		cursor: default;
	}

	.pdt-button-config__arrow:active:not(:disabled) {
		box-shadow: none;
		padding: 0;
	}
```

- [ ] **Step 2: Build to verify**

Run: `npx rollup -c`
Expected: Build succeeds

- [ ] **Step 3: Commit**

```bash
git add src/style.css
git commit -m "style: add button config list styles"
```

---

### Task 6: Verify full build and manual test

- [ ] **Step 1: Full production build**

Run: `npx rollup -c`
Expected: Build succeeds with no errors or warnings

- [ ] **Step 2: Verify dist output exists**

Run: `dir dist\script.user.js`
Expected: File exists and is non-empty

- [ ] **Step 3: Final commit if any fixes were needed**

```bash
git add -A
git commit -m "chore: button config field final adjustments"
```
