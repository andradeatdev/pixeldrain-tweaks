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
	const wrapper = document.createElement("label");
	wrapper.className = "pdt-field pdt-field--textarea";

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

	const textarea = document.createElement("textarea");
	textarea.className = "pdt-field__textarea";
	textarea.value = defaultValue;
	textarea.rows = rows;

	if (placeholder) {
		textarea.placeholder = placeholder;
	}

	wrapper.append(textarea);

	let debounceTimer: ReturnType<typeof setTimeout>;
	textarea.addEventListener("input", () => {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			onChange?.(textarea.value);
		}, 300);
	});

	return wrapper;
}
