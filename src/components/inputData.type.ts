export interface SortableI {
	id: string | number;
}

export interface InputData extends SortableI {
	file: File;
	name: string;
	url: string;
	id: string;
	type: string;
	size: number;
	lastModified: Date;
}

export interface PanelData {
	pageFileName: string;
	panels: InputData[];
}

export interface SpeechBubbleData {
	panelFileName: string;
	speechBubbles: InputData[];
}

export interface SpeechData {
	panelFileName: string; // Hash FileName
	speechBubbleFileName: string; // Hash fileName
	text: string;
	audio: InputData | null;
	audioLen: number;
}

export interface DialogueData extends SortableI {
	id: number;
	text: string;
}
