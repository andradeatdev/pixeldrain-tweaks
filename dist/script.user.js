// ==UserScript==
// @name            Pixeldrain Tweaks
// @namespace       https://greasyfork.org/users/821661
// @version         2.0.2
// @description     Adds direct-download buttons and links for Pixeldrain files using an alternate proxy — inspired by 'Pixeldrain Download Bypass' by hhoneeyy and MegaLime0
// @author          hdyzen
// @icon            https://www.google.com/s2/favicons?domain=pixeldrain.com/&sz=64
// @match           https://pixeldrain.com/*
// @match           https://pixeldrain.net/*
// @match           https://pixeldrain.dev/*
// @match           https://pixeldrain.co/*
// @match           https://pixeldrain.cc/*
// @match           https://pixeldrain.in/*
// @run-at          document-end
// @grant           GM_openInTab
// @grant           GM_addStyle
// @grant           GM_getValue
// @grant           GM_setValue
// ==/UserScript==

const DEFAULT_CUSTOM_PROXIES = [
"https://cdn.pixeldrain.eu.cc",
"# Lines starting with # are ignored",
"# https://pixeldrain.fdyzen.workers.dev"].
join("\n");

function openTab(url) {
  if (typeof GM_openInTab !== "undefined") return GM_openInTab(url);
  return window.open(url, "_blank");
}

function getRandom(arr) {
  if (arr.length === 0) throw new Error("Can't get random item, array is empty.");
  return arr[Math.floor(Math.random() * arr.length)];
}

function getProxyURL() {
  const raw = GM_getValue("customProxies", DEFAULT_CUSTOM_PROXIES);
  const proxies = [];

  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("#")) continue;

    proxies.push(line);
  }

  return getRandom(proxies);
}

const $window = unsafeWindow ? unsafeWindow : window;

function getCurrentFile() {
  const viewerData = $window.viewer_data;
  if (!viewerData) {
    throw new Error("Can't get current file, viewer data is empty.");
  }

  if (viewerData.type === "file") {
    return viewerData.api_response;
  }

  const file = viewerData.api_response.files.find((f) => f.selected);
  if (!file) {
    throw new Error("Can't get current file, not found selected.");
  }

  return file;
}

function getAllFiles() {
  const viewerData = $window.viewer_data;
  if (!viewerData) {
    throw new Error("Can't get files, viewer data is empty.");
  }

  if (viewerData.type === "file") {
    return [viewerData.api_response];
  }

  return viewerData.api_response.files;
}

function getCurrentList() {
  const viewerData = $window.viewer_data;
  if (!viewerData) {
    throw new Error("Can't get current list, viewer data is empty.");
  }

  if (viewerData.type === "file") {
    throw new Error("Can't get current list, page is a type file.");
  }

  return viewerData.api_response.id;
}

function getFileProxyURL() {
  const currentFile = getCurrentFile();
  const proxyURL = getProxyURL();
  return `${proxyURL}/${currentFile.id}?download=`;
}

function getFilesProxyURLs() {
  const filesIDs = getAllFiles();
  const proxyURL = getProxyURL();
  return filesIDs.map((f) => `${proxyURL}/${f.id}?filename=${f.id}.${f.name.split(".").at(-1) || "txt"}`);
}

function getListProxyURL() {
  const currentListID = getCurrentList();
  const proxyURL = getProxyURL();
  return `${proxyURL}/zip/${currentListID}`;
}

function downloadCurrentFile() {
  openTab(getFileProxyURL());
}

function downloadCurrentList() {
  openTab(getListProxyURL());
}

function copyFileLink() {
  const currentFile = getCurrentFile();
  const proxyURL = getProxyURL();
  $window.navigator.clipboard.writeText(
    `${proxyURL}/${currentFile.id}?filename=${currentFile.id}.${currentFile.name.split(".").at(-1) || "txt"}`
  );
}

function copyFilesLinks() {
  $window.navigator.clipboard.writeText(getFilesProxyURLs().join("\n"));
}

function copyListLink() {
  const currentListID = getCurrentList();
  const proxyURL = getProxyURL();
  $window.navigator.clipboard.writeText(`${proxyURL}/zip/${currentListID}?filename=${currentListID}.zip`);
}

const CONFIG = {
  buttons: [
  { icon: "save_alt", text: "DL file", action: downloadCurrentFile },
  { icon: "save_alt", text: "DL list zip", action: downloadCurrentList },
  { icon: "content_copy", text: "Copy link", action: copyFileLink },
  { icon: "copy_all", text: "Copy all links", action: copyFilesLinks },
  { icon: "folder_copy", text: "Copy list link", action: copyListLink },
  { icon: "link", text: "Show links", attrs: { popovertarget: "pdt-urls" } },
  { icon: "settings", text: "Settings", attrs: { popovertarget: "pdt-menu" } }],


  fields: {
    customProxies: {
      type: "textarea",
      label: "Custom proxy URLs",
      description: "Separated by newline",
      placeholder: "https://proxy1.com/api\nhttps://proxy2.com/api",
      value: GM_getValue("customProxies", DEFAULT_CUSTOM_PROXIES)
    },
    forceViewVideo: {
      type: "toggle",
      label: "Force view video",
      description: "Force view video, even if it's not logged.",
      value: GM_getValue("forceViewVideo", true)
    }
  }
};

function createToggleField({ label, description, defaultValue, onChange }) {
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

function createTextareaField({
  label,
  description,
  placeholder,
  defaultValue = "",
  rows = 4,
  onChange
}) {
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

  let debounceTimer;
  textarea.addEventListener("input", () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      onChange?.(textarea.value);
    }, 300);
  });

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

function createSettingsModal() {
  const content = document.createElement("div");
  content.className = "pdt-settings__content";

  for (const [key, field] of Object.entries(CONFIG.fields)) {
    switch (field.type) {
      case "toggle":{
          const toggle = createToggleField({
            label: field.label,
            description: field.description,
            defaultValue: field.value,
            onChange: (v) => GM_setValue(key, v)
          });
          content.append(toggle);
          break;
        }
      case "textarea":{
          const textarea = createTextareaField({
            label: field.label,
            description: field.description,
            placeholder: field.placeholder,
            defaultValue: field.value,
            onChange: (v) => GM_setValue(key, v)
          });
          content.append(textarea);
          break;
        }
    }
  }

  return createModal("pdt-menu", "PDT Settings", content);
}

function createShowUrlsModal() {
  const viewerData = $window.viewer_data;
  if (!viewerData) {
    throw new Error("Can't create Show URLs modal, viewer data is empty.");
  }

  const urls = [];

  if (viewerData.type === "file") {
    urls.push(getFileProxyURL());
  } else {
    urls.push(...getFilesProxyURLs(), getListProxyURL());
  }

  const content = document.createElement("div");
  content.className = "pdt-urls__content";

  const textarea = document.createElement("textarea");
  textarea.className = "pdt-urls__textarea";
  textarea.readOnly = true;
  textarea.value = urls.join("\n");
  textarea.rows = Math.min(urls.length + 1, 15);

  const copyBtn = document.createElement("button");
  copyBtn.className = "pdt-urls__copy";
  copyBtn.textContent = "Copy all";
  copyBtn.addEventListener("click", () => {
    $window.navigator.clipboard.writeText(textarea.value);
  });

  content.append(textarea, copyBtn);
  return createModal("pdt-urls", "Show URLs", content);
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

GM_addStyle(`
.file_viewer:has(.gallery) :is([title="DL file"], [title="Copy file"]) {
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

    .pdt-settings__content {
        display: flex;
        flex-direction: column;
        gap: 24px;

        padding: 20px;
    }

    .pdt-field {
        display: flex;
        flex-direction: column;
    }

    .pdt-field--toggle {
        flex-direction: row;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;

        background-color: rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.03);
        border-radius: 6px;
        padding: 12px;
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

    .pdt-field__textarea {
        border-radius: 6px;
        color: var(--body_text_color);
        font-size: 14px;
        font-family: monospace;
        padding: 10px 12px;
        resize: vertical;
        min-height: 80px;
        width: 100%;
        box-sizing: border-box;
        transition: border-color 0.2s, background-color 0.2s;
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
        transition: background-color 0.3s, border-color 0.3s;
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
        transition: transform 0.3s, background-color 0.3s, box-shadow 0.3s;
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

    .pdt-urls__content {
        display: flex;
        flex-direction: column;
        gap: 16px;

        padding: 20px;
    }

    .pdt-urls__textarea {
        border-radius: 6px;
        color: var(--body_text_color);
        font-size: 14px;
        font-family: monospace;
        padding: 10px 12px;
        resize: vertical;
        min-height: 80px;
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
        transition: background-color 0.2s, color 0.2s;
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

`);
