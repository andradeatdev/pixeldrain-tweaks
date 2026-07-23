export interface FileItem {
	detail_href: string;
	description: string;
	id: string;
	name: string;
	size: number;
	views: number;
	bandwidth_used: number;
	bandwidth_used_paid: number;
	downloads: number;

	date_created: string;
	date_upload: string;
	date_last_view: string;

	mime_type: string;
	thumbnail_href: string;
	hash_sha256: string;

	delete_after_date: string;
	delete_after_downloads: number;

	availability: string;
	availability_message: string;

	abuse_type: string;
	abuse_reporter_name: string;

	title: string;
	file_count: number;
	files: FileItem[];

	can_edit: boolean;
	can_download: boolean;
	show_ads: boolean;
	allow_video_player: boolean;

	download_speed_limit: number;

	get_href: string;
	info_href: string;
	download_href: string;
	icon_href: string;
	timeseries_href: string;

	selected: boolean;
}

export interface ViewerData {
	type: "list" | "file";

	api_response: FileItem;

	captcha_key: string;
	embedded: boolean;
	user_ads_enabled: boolean;
	theme_uri: string;
}

declare global {
	interface Window {
		viewer_data: ViewerData;
		_viewer_data: ViewerData;
	}
}
