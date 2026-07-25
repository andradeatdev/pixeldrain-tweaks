interface FieldBaseOptions {
	label: string;
	description?: string;
	className?: string;
}

export function createFieldBase({ label, description, className }: FieldBaseOptions) {
	const wrapper = document.createElement("label");
	wrapper.className = `pdt-field${className ? ` ${className}` : ""}`;

	const labelText = document.createElement("span");
	labelText.className = "pdt-field__label";
	labelText.textContent = label;
	wrapper.append(labelText);

	if (!description) return { wrapper, label: labelText };

	const descText = document.createElement("span");
	descText.className = "pdt-field__description";
	descText.textContent = description;
	wrapper.append(descText);

	return { wrapper, label: labelText, description: descText };
}

export function debounce<T extends string>(fn: (value: T) => void, ms = 300): (value: T) => void {
	let timer: ReturnType<typeof setTimeout>;
	return (value: T) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(value), ms);
	};
}
