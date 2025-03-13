export interface ImageInfoI {
	url: string;
	name: string;
	width: number;
	height: number;
	size: number;
}

export interface AudioInfoI {
	url: string;
	name: string;
	len: number; // seconds
	size: number; // bytes
}

export interface CaptionI {
	name: string;
	url: string;
}

export interface PanelTrackI {
	trackName: string;
	tracks: {
		start: number;
		end: number;
		file: ImageInfoI;
	}[];
}

export interface SpeechBubbleTrackI {
	trackName: string;
	tracks: {
		start: number;
		end: number;
		file: ImageInfoI;
	}[];
}

export interface AudioTrackI {
	trackName: string;
	tracks: {
		start: number;
		end: number;
		trimStart: number;
		trimEnd: number;
		file: AudioInfoI;
	}[];
}

export interface CaptionTrackI {
	name: string;
	url: string;
}

export type VidSettingType = {
	duration: number; // second
	vidBackground: string;
	transition: string;
	frameRate: number; // fps
	resolution: number;
	orientation: "landscape" | "portrait";
	resizeMode: string;
};
