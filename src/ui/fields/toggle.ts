import { createFieldBase } from "./";

interface ToggleFieldOptions {
	label: string;
	description?: string;
	defaultValue: boolean;
	onChange?: (value: boolean) => void;
}

export function createToggleField({
	label,
	description,
	defaultValue,
	onChange,
}: ToggleFieldOptions): HTMLLabelElement {
	const { wrapper, label: labelText } = createFieldBase({
		label,
		description,
		className: "pdt-field--card pdt-field--toggle",
	});

	const textWrapper = document.createElement("span");
	textWrapper.className = "pdt-field__text";

	const descClone = wrapper.querySelector(".pdt-field__description");
	textWrapper.append(labelText);
	if (descClone) textWrapper.append(descClone);

	const track = document.createElement("span");
	track.className = "pdt-toggle";

	const input = document.createElement("input");
	input.type = "checkbox";
	input.checked = defaultValue;
	input.className = "pdt-toggle__input";

	const slider = document.createElement("span");
	slider.className = "pdt-toggle__slider";

	track.append(input, slider);
	wrapper.append(textWrapper, track);

	input.addEventListener("change", () => {
		onChange?.(input.checked);
	});

	return wrapper;
}
