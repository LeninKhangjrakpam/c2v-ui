export type UploadPageResponse = {
	images: { filename: string; blob: string }[];
};

export type GenPanelResponse = Record<
	string, // PageFileName
	{ filename: string; blob: string }[]
>;

export type GenAssetResponse = Record<
	string, // PanelFileName
	{ filename: string; blob: string }[]
>;

export type RecogniseTextResponse = {
	panelFileName: string;
	speechBubbleFileName: string;
	text: string;
}[];

export type GenerateAudioResponse = {
	speechBubbleFileName: string;
	panelName: string;
	text: string;
	audio: string | null | undefined;
	audExt: string;
	audioLen: number;
}[];

export type GenerateAudioReq = {
	speechBubbleFileName: string;
	panelFileName: string;
	text: string;
};
