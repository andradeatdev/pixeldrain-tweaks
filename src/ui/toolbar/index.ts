export function createToolbarButton(text: string, icon: string) {
	const button = document.createElement("button");
	button.textContent = text;
	button.title = text;
	button.className = "toolbar_button svelte-jngqwx pdt-toolbar--button";
	button.insertAdjacentHTML("afterbegin", icon);

	return button;
}
