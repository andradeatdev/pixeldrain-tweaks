import { CONFIG } from "@/config";
import { createModal } from "./modal";
import { createTextareaField } from "./textarea";
import { createToggleField } from "./toggle";

export function createSettingsModal(): HTMLDivElement {
	const content = document.createElement("div");
	content.className = "pdt-settings__content";

	for (const [key, field] of Object.entries(CONFIG.fields)) {
		switch (field.type) {
			case "toggle": {
				const toggle = createToggleField({
					label: field.label,
					description: field.description,
					defaultValue: field.value,
					onChange: (v) => GM_setValue(key, v),
				});
				content.append(toggle);
				break;
			}
			case "textarea": {
				const textarea = createTextareaField({
					label: field.label,
					description: field.description,
					placeholder: field.placeholder,
					defaultValue: field.value,
					onChange: (v) => GM_setValue(key, v),
				});
				content.append(textarea);
				break;
			}
		}
	}

	return createModal("pdt-menu", "PDT Settings", content);
}
