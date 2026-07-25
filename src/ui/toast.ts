let el: HTMLDivElement | null = null;

function ensureToast(): HTMLDivElement {
	if (el) return el;

	el = document.createElement("div");
	el.popover = "auto";
	el.className = "pdt-toast";
	document.body.append(el);

	return el;
}

export function showToast(message: string): void {
	const toast = ensureToast();

	toast.textContent = message;
	toast.showPopover();
	toast.addEventListener("animationend", (ev) => ev.animationName === "pdt-toast-out" && toast.showPopover());
}
