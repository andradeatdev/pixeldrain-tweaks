import { FIELDS, getSetting, setSetting } from "./";
import { createInputField } from "@/ui/fields/input";
import { createModal } from "@/ui/modal";
import { createTextareaField } from "@/ui/fields/textarea";
import { createToggleField } from "@/ui/fields/toggle";

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
