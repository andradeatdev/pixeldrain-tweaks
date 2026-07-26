// ==UserScript==
// @name            Pixeldrain Tweaks
// @namespace       https://greasyfork.org/users/821661
// @version         2.1.0
// @description     Adds direct-download buttons and links for Pixeldrain files using an alternate proxy — inspired by 'Pixeldrain Download Bypass' by hhoneeyy and MegaLime0
// @author          hdyzen
// @icon            https://www.google.com/s2/favicons?domain=pixeldrain.com/&sz=64
// @match           https://pixeldrain.com/*
// @match           https://pixeldrain.net/*
// @match           https://pixeldrain.dev/*
// @match           https://pixeldrain.co/*
// @match           https://pixeldrain.cc/*
// @match           https://pixeldrain.in/*
// @run-at          document-start
// @grant           GM_openInTab
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_xmlhttpRequest
// ==/UserScript==

const DEFAULT_CUSTOM_PROXIES = [
"https://cdn.pixeldrain.eu.cc",
"# Lines starting with # are ignored",
"# https://pixeldrain.fdyzen.workers.dev"].
join("\n");

const DEFAULT_ARIA2_URL = "http://localhost:6800/jsonrpc";

const FIELDS = {
  customProxies: {
    type: "textarea",
    label: "Custom proxy URLs",
    description: "Separated by newline",
    placeholder: DEFAULT_CUSTOM_PROXIES,
    default: DEFAULT_CUSTOM_PROXIES
  },
  aria2URL: {
    type: "input",
    label: "Aria2 RPC URL",
    description: "Aria2 RPC URL",
    placeholder: DEFAULT_ARIA2_URL,
    default: DEFAULT_ARIA2_URL
  },
  aria2Secret: {
    type: "input",
    label: "Aria2 RPC Secret",
    description: "Secret token for aria2 RPC authentication (leave empty if not needed)",
    placeholder: "",
    default: ""
  },
  forceViewVideo: {
    type: "toggle",
    label: "Force view video",
    description: "Force view video, even if it's not logged.",
    default: true
  }
};

function getSetting(key) {
  const field = FIELDS[key];
  return GM_getValue(key, field.default);
}

function setSetting(key, value) {
  GM_setValue(key, value);
}

const $window = unsafeWindow ? unsafeWindow : window;

let el = null;

function ensureToast() {
  if (el) return el;

  el = document.createElement("div");
  el.popover = "auto";
  el.className = "pdt-toast";
  document.body.append(el);

  return el;
}

function showToast(message) {
  const toast = ensureToast();

  toast.textContent = message;
  toast.showPopover();
  toast.addEventListener("animationend", (ev) => ev.animationName === "pdt-toast-out" && toast.showPopover());
}

function getRandom(arr) {
  if (arr.length === 0) throw new Error("Can't get random item, array is empty.");

  const index = Math.floor(Math.random() * arr.length);
  const item = arr[index];
  if (item === undefined) throw new Error("Can't get random item, array element is undefined.");

  return item;
}

async function copyToClipboard(text) {
  try {
    return $window.navigator.clipboard.writeText(text);
  } catch {
    showToast("Failed to copy to clipboard");
  }
}

function openTab(url) {
  if (typeof GM_openInTab !== "undefined") return GM_openInTab(url);
  return window.open(url, "_blank");
}

function getViewerData() {
  const viewerData = $window.viewer_data;
  if (!viewerData) {
    throw new Error("Viewer data is empty.");
  }
  return viewerData;
}

function getCurrentFile() {
  const data = getViewerData();

  if (data.type === "file") {
    return data.api_response;
  }

  const file = data.api_response.files.find((f) => f.selected);
  if (!file) {
    throw new Error("Can't get current file, not found selected.");
  }

  return file;
}

function getAllFiles() {
  const data = getViewerData();

  if (data.type === "file") {
    return [data.api_response];
  }

  return data.api_response.files;
}

function getCurrentList() {
  const data = getViewerData();

  if (data.type === "file") {
    throw new Error("Can't get current list, page is a type file.");
  }

  return data.api_response.id;
}

function patchViewerData() {
  Object.defineProperty($window, "viewer_data", {
    get() {
      return $window._viewer_data;
    },
    set(v) {
      if (v.type === "file") v.api_response.allow_video_player = true;

      if (v.type === "list") {
        for (const f of v.api_response.files) {
          f.allow_video_player = true;
        }
      }

      $window._viewer_data = v;
    }
  });
}

function getProxyURL() {
  const raw = getSetting("customProxies");
  const proxies = [];

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("#")) continue;

    proxies.push(trimmed);
  }

  if (proxies.length === 0) {
    throw new Error("No proxy URLs configured. Add at least one in Settings.");
  }

  return getRandom(proxies);
}

function getFileExtension(name) {
  return name.split(".").at(-1) || "txt";
}

function getFileProxyURL() {
  const currentFile = getCurrentFile();
  return `${getProxyURL()}/${currentFile.id}?download=`;
}

function getFileCopyURL() {
  const currentFile = getCurrentFile();
  return `${getProxyURL()}/${currentFile.id}?filename=${currentFile.id}.${getFileExtension(currentFile.name)}`;
}

function getFilesProxyURLs() {
  const files = getAllFiles();
  const proxyURL = getProxyURL();
  return files.map((f) => `${proxyURL}/${f.id}?filename=${f.id}.${getFileExtension(f.name)}`);
}

function getListProxyURL() {
  return `${getProxyURL()}/zip/${getCurrentList()}`;
}

function getListCopyURL() {
  const listID = getCurrentList();
  return `${getProxyURL()}/zip/${listID}?filename=${listID}.zip`;
}

function getFileRawURL() {
  const currentFile = getCurrentFile();
  return `${getProxyURL()}/${currentFile.id}`;
}

function getFilesRawURLs() {
  const files = getAllFiles();
  return files.map((f) => `${getProxyURL()}/${f.id}`);
}

function getZipRawURL() {
  return `${getProxyURL()}/zip/${getCurrentList()}`;
}

function downloadCurrentFile() {
  openTab(getFileProxyURL());
}

function downloadCurrentList() {
  openTab(getListProxyURL());
}

async function copyFileLink() {
  await copyToClipboard(getFileCopyURL());
}

async function copyFilesLinks() {
  await copyToClipboard(getFilesProxyURLs().join("\n"));
}

async function copyListLink() {
  await copyToClipboard(getListCopyURL());
}

function sendToAria2(url) {
  const aria2URL = getSetting("aria2URL");
  if (!aria2URL) throw new Error("Aria2 URL is not set, check if you have it in Settings.");

  const aria2Secret = getSetting("aria2Secret");
  const params = [Array.isArray(url) ? url : [url]];
  if (aria2Secret) {
    params.unshift(`token:${aria2Secret}`);
  }

  GM_xmlhttpRequest({
    url: aria2URL,
    method: "POST",
    responseType: "json",
    data: JSON.stringify({
      jsonrpc: "2.0",
      id: `pdt-${Date.now()}`,
      method: "aria2.addUri",
      params
    }),
    headers: { "Content-Type": "application/json" },
    onerror() {
      showToast("Aria2: connection failed. Check if the server is running.");
    },
    onload(response) {
      console.log("Response", response);
      if (response.status === 200) {
        showToast("Aria2: success");
        return;
      }

      const body = response.response;
      if (body?.error.message) {
        showToast(`Aria2: ${body.error.message || "RPC error"}`);
        return;
      }

      showToast(`Aria2: HTTP ${response.status}`);
    }
  });
}

function sendFileToAria2() {
  sendToAria2(getFileRawURL());
}

function sendListToAria2() {
  sendToAria2(getFilesRawURLs());
}

function sendZipToAria2() {
  sendToAria2(getZipRawURL());
}

const CONFIG = {
  buttons: [
  { icon: "save_alt", text: "DL file", action: downloadCurrentFile },
  { icon: "save_alt", text: "DL list zip", action: downloadCurrentList },
  { icon: "content_copy", text: "Copy link", action: copyFileLink },
  { icon: "copy_all", text: "Copy all links", action: copyFilesLinks },
  { icon: "folder_copy", text: "Copy list link", action: copyListLink },
  { icon: "launch", text: "Aria2 (file)", action: sendFileToAria2 },
  { icon: "launch", text: "Aria2 (list)", action: sendListToAria2 },
  { icon: "launch", text: "Aria2 (zip)", action: sendZipToAria2 },
  { icon: "link", text: "Show links", attrs: { popovertarget: "pdt-urls" } },
  { icon: "settings", text: "Settings", attrs: { popovertarget: "pdt-menu" } }]

};

function createFieldBase({ label, description, className }) {
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

function debounce(fn, ms = 300) {
  let timer;
  return (value) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(value), ms);
  };
}

function createInputField({
  label,
  description,
  placeholder,
  defaultValue = "",
  onChange
}) {
  const { wrapper } = createFieldBase({
    label,
    description,
    className: "pdt-field--card pdt-field--input"
  });

  const input = document.createElement("input");
  input.type = "text";
  input.className = "pdt-field__input";
  input.value = defaultValue;

  if (placeholder) {
    input.placeholder = placeholder;
  }

  wrapper.append(input);

  const emit = debounce((v) => onChange?.(v));
  input.addEventListener("input", () => emit(input.value));

  return wrapper;
}

function getIcon(icon) {
  return `<i class="icon">${icon}</i>`;
}

function createModal(id, title, content) {
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

function createTextareaField({
  label,
  description,
  placeholder,
  defaultValue = "",
  rows = 4,
  onChange
}) {
  const { wrapper } = createFieldBase({
    label,
    description,
    className: "pdt-field--textarea"
  });

  const textarea = document.createElement("textarea");
  textarea.className = "pdt-textarea";
  textarea.value = defaultValue;
  textarea.rows = rows;

  if (placeholder) {
    textarea.placeholder = placeholder;
  }

  wrapper.append(textarea);

  const emit = debounce((v) => onChange?.(v));
  textarea.addEventListener("input", () => emit(textarea.value));

  return wrapper;
}

function createToggleField({
  label,
  description,
  defaultValue,
  onChange
}) {
  const { wrapper, label: labelText } = createFieldBase({
    label,
    description,
    className: "pdt-field--card pdt-field--toggle"
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

function createSettingsModal() {
  const content = document.createElement("div");
  content.className = "pdt-modal__content";

  for (const [key, field] of Object.entries(FIELDS))


  {
    switch (field.type) {
      case "toggle":{
          const toggle = createToggleField({
            label: field.label,
            description: field.description,
            defaultValue: getSetting(key),
            onChange: (v) => setSetting(key, v)
          });
          content.append(toggle);
          break;
        }
      case "input":{
          const input = createInputField({
            label: field.label,
            description: field.description,
            placeholder: field.placeholder,
            defaultValue: getSetting(key),
            onChange: (v) => setSetting(key, v)
          });
          content.append(input);
          break;
        }
      case "textarea":{
          const textarea = createTextareaField({
            label: field.label,
            description: field.description,
            placeholder: field.placeholder,
            defaultValue: getSetting(key),
            onChange: (v) => setSetting(key, v)
          });
          content.append(textarea);
          break;
        }
    }
  }

  return createModal("pdt-menu", "PDT Settings", content);
}

function getUrlsForPage() {
  const viewerData = $window.viewer_data;
  if (!viewerData) return [];

  if (viewerData.type === "file") {
    return [getFileProxyURL()];
  }

  return [...getFilesProxyURLs(), getListProxyURL()];
}

function refreshUrls(textarea) {
  const urls = getUrlsForPage();
  textarea.value = urls.join("\n");
  textarea.rows = Math.min(urls.length + 1, 15);
}

function createShowUrlsModal() {
  const content = document.createElement("div");
  content.className = "pdt-modal__content";

  const textarea = document.createElement("textarea");
  textarea.className = "pdt-textarea pdt-urls__textarea";
  textarea.readOnly = true;

  const copyBtn = document.createElement("button");
  copyBtn.className = "pdt-urls__copy";
  copyBtn.textContent = "Copy all";
  copyBtn.addEventListener("click", () => copyToClipboard(textarea.value));

  content.append(textarea, copyBtn);

  const modal = createModal("pdt-urls", "Show URLs", content);
  refreshUrls(textarea);
  modal.addEventListener("popovershow", () => refreshUrls(textarea));

  return modal;
}

function createToolbarButton(text, icon) {
  const button = document.createElement("button");
  button.textContent = text;
  button.title = text;
  button.className = "toolbar_button svelte-jngqwx pdt-toolbar--button";
  button.insertAdjacentHTML("afterbegin", icon);

  return button;
}

function createToolbarSeparator() {
  const div = document.createElement("div");
  div.className = "separator svelte-jngqwx";
  return div;
}

function main() {
  try {
    if (getSetting("forceViewVideo")) {
      patchViewerData();
    }

    document.addEventListener("DOMContentLoaded", () => onLoaded());
  } catch (e) {
    showToast(e instanceof Error ? e.message : "An error occurred");
  }
}
main();

function onLoaded() {
  const separator = document.querySelector(".toolbar .separator");
  if (!separator) {
    throw new Error("Separator can't be found.");
  }

  const settingsModal = createSettingsModal();
  const showUrlsModal = createShowUrlsModal();

  separator.before(createToolbarSeparator());

  for (const btn of CONFIG.buttons) {
    const item = createToolbarButton(btn.text, getIcon(btn.icon));
    if (btn.action) item.addEventListener("click", () => btn.action());

    for (const [key, value] of Object.entries(btn.attrs ?? {})) {
      item.setAttribute(key, value);
    }
    separator.before(item);
  }

  document.body.append(settingsModal, showUrlsModal);
}

GM_addStyle(`
/* Hide file buttons */
.file_viewer:has(.gallery) :is([title="DL file"], [title="Copy link"], [title="Aria2 (file)"]) {
	display: none;
}

/* Hide list buttons */
.file_viewer:not(:has(.list_navigator), :has(.gallery))
:is(
	[title="DL list zip"],
	[title="Copy all links"],
	[title="Copy list link"],
	[title="Aria2 (list)"],
	[title="Aria2 (zip)"]
) {
	display: none;
}

.pdt-toolbar--button {
	gap: 5px;
}

@scope (.pdt-popover) {
	* {
		margin: 0;
		line-height: normal;
	}

	:scope {
		flex-direction: column;

		min-width: 420px;

		background-color: var(--body_color);
		border: 1px solid var(--separator);
		border-radius: 8px;
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
	}

	:scope:popover-open {
		display: flex;
	}

	:scope::backdrop {
		background-color: rgb(0 0 0 / 0.2);
	}

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;

		padding: 6px 20px;
		border-bottom: 1px solid rgba(255 255 255 / 0.05);
	}

	header span {
		font-size: 18px;
		font-weight: 600;
		color: var(--body_text_color);
	}

	header button {
		background: none;
		box-shadow: none;

		font-size: 20px;
		line-height: 1;
		color: var(--body_text_color);
		border: none;
		cursor: pointer;
		transition: color 0.2s;
	}

	header button:active {
		box-shadow: none;
		padding: 3px;
	}

	header button:hover {
		color: hsl(from var(--body_text_color) h s calc(l + 10));
		background: hsl(from var(--highlight_background) h s l / 0.3);
	}

	header button:focus {
		background-color: hsl(from var(--highlight_background) h s l / 0.3);
		outline: 1px solid var(--highlight_background);
	}

	.pdt-modal__content {
		display: flex;
		flex-direction: column;
		gap: 16px;

		padding: 20px;
	}

	.pdt-field {
		display: flex;
		flex-direction: column;
	}

	.pdt-field--card {
		background-color: rgba(0, 0, 0, 0.1);
		border: 1px solid rgba(255, 255, 255, 0.03);
		border-radius: 6px;
		padding: 12px;
	}

	.pdt-field--toggle {
		flex-direction: row;
		align-items: flex-start;
		justify-content: space-between;
		gap: 16px;
	}

	.pdt-field__text {
		display: flex;
		flex-direction: column;
	}

	.pdt-field__label {
		font-size: 14px;
		font-weight: 600;
		color: var(--body_text_color);
	}

	.pdt-field__description {
		font-size: 12px;
		color: hsl(from var(--body_text_color) h s calc(l - 10));
		line-height: 1.4;
	}

	.pdt-field--input {
		gap: 6px;
	}

	:scope .pdt-field__input {
		padding: 6px 10px;
		color: var(--body_text_color);
	}

	.pdt-field__input:focus {
		border-color: var(--highlight_background);
		outline: none;
	}

	.pdt-textarea {
		border-radius: 6px;
		color: var(--body_text_color);
		font-size: 14px;
		font-family: monospace;
		padding: 10px 12px;
		resize: vertical;
		min-height: 80px;
		width: 100%;
		box-sizing: border-box;
		transition:
			border-color 0.2s,
			background-color 0.2s;
	}

	.pdt-toggle {
		position: relative;
		display: inline-block;
		width: 38px;
		height: 22px;
	}

	.pdt-toggle__input {
		opacity: 0;
		width: 0;
		height: 0;
		position: absolute;
		z-index: -1;
	}

	.pdt-toggle__slider {
		position: absolute;
		cursor: pointer;
		inset: 0;
		background-color: #4c525c;
		border: 1px solid #4a5059;
		border-radius: 22px;
		transition:
			background-color 0.3s,
			border-color 0.3s;
	}

	.pdt-toggle__slider:focus {
		outline-offset: 1px;
		outline: 1px solid var(--highlight_background);
	}

	.pdt-toggle__slider::before {
		content: "";
		position: absolute;
		height: 14px;
		width: 14px;
		left: 3px;
		bottom: 3px;
		background-color: #a0a6b1;
		border-radius: 50%;
		transition:
			transform 0.3s,
			background-color 0.3s,
			box-shadow 0.3s;
	}

	.pdt-toggle__input:checked + .pdt-toggle__slider {
		background-color: var(--highlight_background);
		border-color: var(--highlight_background);
	}

	.pdt-toggle__input:checked + .pdt-toggle__slider::before {
		transform: translateX(16px);
		background-color: #ffffff;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	}

	.pdt-urls__textarea {
		max-height: clamp(80px, 45vh, 400px);
		field-sizing: content;
	}

	.pdt-urls__textarea:focus {
		border-color: var(--highlight_background);
	}

	.pdt-urls__copy {
		align-self: flex-start;
		padding: 8px 16px;
		border-radius: 6px;
		border: 1px solid var(--highlight_background);
		background-color: transparent;
		color: var(--highlight_background);
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition:
			background-color 0.2s,
			color 0.2s;
	}

	.pdt-urls__copy:hover {
		background-color: var(--highlight_background);
		color: #fff;
	}

	.pdt-urls__copy:active {
		padding: 8px 16px;
		box-shadow: none;
		transform: scale(0.97);
	}
}

.pdt-toast {
	padding: 10px 20px;
	border-radius: 8px;
	border: 2px solid var(--highlight_background);
	background-color: var(--body_color);
	color: #fff;
	font-size: 14px;
	inset: auto 15px 15px auto;
	box-shadow:
		0 4px 6px -1px rgba(0, 0, 0, 0.05),
		0 10px 15px -3px rgba(0, 0, 0, 0.08);
	animation:
		pdt-toast-in 0.3s ease,
		pdt-toast-out 0.3s ease 2.7s forwards;
}

@keyframes pdt-toast-in {
	from {
		opacity: 0;
		transform: translateY(10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes pdt-toast-out {
	from {
		opacity: 1;
		transform: translateY(0);
	}
	to {
		opacity: 0;
		transform: translateY(10px);
	}
}

`);
