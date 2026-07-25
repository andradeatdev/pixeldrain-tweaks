import { getAllFiles, getCurrentFile, getCurrentList } from "@/file/viewer-data";
import { getProxyURL } from "@/proxy";

function getFileExtension(name: string): string {
	return name.split(".").at(-1) || "txt";
}

export function getFileProxyURL(): string {
	const currentFile = getCurrentFile();
	return `${getProxyURL()}/${currentFile.id}?download=`;
}

export function getFileCopyURL(): string {
	const currentFile = getCurrentFile();
	return `${getProxyURL()}/${currentFile.id}?filename=${currentFile.id}.${getFileExtension(currentFile.name)}`;
}

export function getFilesProxyURLs(): string[] {
	const files = getAllFiles();
	const proxyURL = getProxyURL();
	return files.map((f) => `${proxyURL}/${f.id}?filename=${f.id}.${getFileExtension(f.name)}`);
}

export function getListProxyURL(): string {
	return `${getProxyURL()}/zip/${getCurrentList()}`;
}

export function getListCopyURL(): string {
	const listID = getCurrentList();
	return `${getProxyURL()}/zip/${listID}?filename=${listID}.zip`;
}

export function getFileRawURL(): string {
	const currentFile = getCurrentFile();
	return `${getProxyURL()}/${currentFile.id}`;
}

export function getFilesRawURLs(): string[] {
	const files = getAllFiles();
	return files.map((f) => `${getProxyURL()}/${f.id}`);
}

export function getZipRawURL(): string {
	return `${getProxyURL()}/zip/${getCurrentList()}`;
}
