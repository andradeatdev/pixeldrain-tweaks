import { createFieldBase, debounce } from "./";

interface InputFieldOptions {
	label: string;
	description?: string;
	placeholder?: string;
	defaultValue?: string;
	onChange?: (value: string) => void;
}

export function createInputField({
	label,
	description,
	placeholder,
	defaultValue = "",
	onChange,
}: InputFieldOptions): HTMLLabelElement {
	const { wrapper } = createFieldBase({
		label,
		description,
		className: "pdt-field--card pdt-field--input",
	});

	const input = document.createElement("input");
	input.type = "text";
	input.className = "pdt-field__input";
	input.value = defaultValue;

	if (placeholder) {
		input.placeholder = placeholder;
	}

	wrapper.append(input);

	const emit = debounce<string>((v) => onChange?.(v));
	input.addEventListener("input", () => emit(input.value));

	return wrapper;
}
