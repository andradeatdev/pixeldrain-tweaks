interface ToggleFieldOptions {
	label: string;
	description?: string;
	defaultValue: boolean;
	onChange?: (value: boolean) => void;
}

export function createToggleField({ label, description, defaultValue, onChange }: ToggleFieldOptions): HTMLLabelElement {
	const wrapper = document.createElement("label");
	wrapper.className = "pdt-field pdt-field--toggle";

	const textWrapper = document.createElement("span");
	textWrapper.className = "pdt-field__text";

	const labelText = document.createElement("span");
	labelText.className = "pdt-field__label";
	labelText.textContent = label;
	textWrapper.append(labelText);

	if (description) {
		const descText = document.createElement("span");
		descText.className = "pdt-field__description";
		descText.textContent = description;
		textWrapper.append(descText);
	}

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
