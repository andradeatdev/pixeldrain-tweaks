import { getIcon } from "./icon";

export function createModal(id: string, title: string, content: HTMLElement): HTMLDivElement {
	const modal = document.createElement("div");
	modal.id = id;
	modal.popover = "auto";
	modal.className = "pdt-popover";

	const header = document.createElement("header");
	const titleEl = document.createElement("span");
	const close = document.createElement("button");

	titleEl.textContent = title;
	close.innerHTML = getIcon("close");
	close.setAttribute("popovertarget", id);
	close.setAttribute("popovertargetaction", "hide");

	header.append(titleEl, close);

	modal.append(header, content);
	return modal;
}
