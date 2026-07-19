import { CONFIG } from "@/config";
import { createSettingsModal, createShowUrlsModal, createToolbarButton, createToolbarSeparator } from "@/ui";
import { getIcon } from "@/ui/icon";
import "./style.css";

function main() {
	const separator = document.querySelector(".toolbar .separator");
	if (!separator) {
		throw new Error("Separator can't be found.");
	}

	const settingsModal = createSettingsModal();
	const showUrlsModal = createShowUrlsModal();

	separator.before(createToolbarSeparator());

	for (const btn of CONFIG.buttons) {
		const item = createToolbarButton(btn.text, getIcon(btn.icon));
		if ("action" in btn && btn.action) {
			item.addEventListener("click", () => btn.action?.());
		}
		for (const [key, value] of Object.entries(btn.attrs || {})) {
			item.setAttribute(key, value);
		}
		separator.before(item);
	}

	document.body.append(settingsModal, showUrlsModal);
}
main();
