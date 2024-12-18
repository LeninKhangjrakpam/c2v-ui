export type UploadPageResponse = {
	images: { filename: string; blob: string }[];
};

export type GenPanelResponse = Record<
	string, // PageFileName
	{ filename: string; blob: string }[]
>;

export type GenAssetResponse = Record<
	string, // PageFileName
	{ filename: string; blob: string }[]
>;
