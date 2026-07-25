import { FIELDS, getSetting, setSetting } from "@/settings";
import { createInputField } from "./input";
import { createModal } from "./modal";
import { createTextareaField } from "./textarea";
import { createToggleField } from "./toggle";

export function createSettingsModal(): HTMLDivElement {
	const content = document.createElement("div");
	content.className = "pdt-modal__content";

	for (const [key, field] of Object.entries(FIELDS) as [
		keyof typeof FIELDS,
		(typeof FIELDS)[keyof typeof FIELDS],
	][]) {
		switch (field.type) {
			case "toggle": {
				const toggle = createToggleField({
					label: field.label,
					description: field.description,
					defaultValue: getSetting(key) as boolean,
					onChange: (v) => setSetting(key, v),
				});
				content.append(toggle);
				break;
			}
			case "input": {
				const input = createInputField({
					label: field.label,
					description: field.description,
					placeholder: field.placeholder,
					defaultValue: getSetting(key) as string,
					onChange: (v) => setSetting(key, v),
				});
				content.append(input);
				break;
			}
			case "textarea": {
				const textarea = createTextareaField({
					label: field.label,
					description: field.description,
					placeholder: field.placeholder,
					defaultValue: getSetting(key) as string,
					onChange: (v) => setSetting(key, v),
				});
				content.append(textarea);
				break;
			}
		}
	}

	return createModal("pdt-menu", "PDT Settings", content);
}
