import { createFieldBase, debounce } from "./field";

interface TextareaFieldOptions {
	label: string;
	description?: string;
	placeholder?: string;
	defaultValue?: string;
	rows?: number;
	onChange?: (value: string) => void;
}

export function createTextareaField({
	label,
	description,
	placeholder,
	defaultValue = "",
	rows = 4,
	onChange,
}: TextareaFieldOptions): HTMLLabelElement {
	const { wrapper } = createFieldBase({
		label,
		description,
		className: "pdt-field--textarea",
	});

	const textarea = document.createElement("textarea");
	textarea.className = "pdt-textarea";
	textarea.value = defaultValue;
	textarea.rows = rows;

	if (placeholder) {
		textarea.placeholder = placeholder;
	}

	wrapper.append(textarea);

	const emit = debounce<string>((v) => onChange?.(v));
	textarea.addEventListener("input", () => emit(textarea.value));

	return wrapper;
}
