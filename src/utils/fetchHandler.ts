import { InputData } from "../components/inputData.type";
import { useFetcherResult } from "../hooks/useFetcher";
import {
	UploadPageResponse,
	GenPanelResponse,
	GenAssetResponse,
} from "../api/response.type";
import { PanelData } from "../components/inputData.type";
import { PanelDataHandler } from "../hooks/usePanelData";
import { FileInputHandler } from "../hooks/useFileInput";
import { b64ToBlob, blobToFile } from "./util";
import { apiStore } from "../api/config";

export const imageUploadHandler = (
	inpFiles: InputData[],
	uploadPageFetcher: useFetcherResult<UploadPageResponse>,
) => {
	const data = new FormData();
	// Add inpFiles to formData
	inpFiles.forEach((inpFile) => data.append("files", inpFile.file));
	uploadPageFetcher._fetch(apiStore("uploadPage").href, {
		method: "POST",
		headers: {
			"Content-Type": "application/form",
		},
		body: data,
	});
};

export const panelGenHandler = (
	pageFileName: string[],
	genPanelFetcher: useFetcherResult<GenPanelResponse>,
) => {
	const data = { pages: pageFileName.map((d) => ({ filename: d })) };
	console.log("panel generator handler called", data);

	genPanelFetcher._fetch(apiStore("genPanels").href, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
};

export const imageUploadPostHandler = (
	res: UploadPageResponse,
	inpFilesHandlers: FileInputHandler,
	genPanelFetcher: useFetcherResult<GenPanelResponse>,
) => {
	// Update InpFiles with pages return from server
	inpFilesHandlers.clearFiles();
	const mimeTye = "image/jpeg";
	const resFiles: File[] = [];
	res.images.forEach((d) => {
		const blb = b64ToBlob(d.blob, mimeTye);
		const f = blobToFile(blb, d.filename, mimeTye, Date.now());
		resFiles.push(f);
	});
	inpFilesHandlers.addFiles(resFiles);

	// Submit InpFiles for panel generation
	panelGenHandler(
		res.images.map((d) => d.filename),
		genPanelFetcher,
	);
};

// export const imageUploadPostHandler = (
// 	res: UploadPageResponse,
// 	inpFilesHandlers: FileInputHandler,
// 	_panelGenHandler: (
// 		pageFileName: string,
// 		genPanelFetcher: useFetcherResult<GenPanelResponse>,
// 	) => void,
// ) => {
// 	// Update InpFiles with pages return from server
// 	inpFilesHandlers.clearFiles();
// 	const mimeTye = "image/jpeg";
// 	const resFiles: File[] = [];
// 	res.images.forEach((d) => {
// 		const blb = b64ToBlob(d.blob, mimeTye);
// 		const f = blobToFile(blb, d.filename, mimeTye, Date.now());
// 		resFiles.push(f);
// 	});
// 	inpFilesHandlers.addFiles(resFiles);

// 	// Submit InpFiles for panel generation
// 	panel;
// 	_panelGenHandler();
// };

export const panelGenPostHandler = (
	res: GenPanelResponse,
	panelsHandlers: PanelDataHandler,
) => {
	panelsHandlers.resetPanel();
	const mimeTye = "image/jpeg";

	for (const pFileNames in res) {
		const ps = res[pFileNames];
		const panelData = ps?.map((p) => {
			const blb = b64ToBlob(p.blob, mimeTye);
			return blobToFile(blb, p.filename, mimeTye, Date.now());
		});
		if (panelData) panelsHandlers.addPanelGrp(pFileNames, panelData);
	}
};

export const assetGenHandler = (
	panels: PanelData[],
	genAsset: useFetcherResult<GenAssetResponse>,
) => {
	const pageFileName: Record<string, string> = {};
	panels.forEach((panel) => (pageFileName[panel.pageFileName] = ""));
	const data = { panels: pageFileName };
	console.log("Panel Data submitted: ", data);

	genAsset._fetch("http://localhost:8000/generateAssets", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});
};

export const assetGenPostHandler = (
	res: GenAssetResponse,
	speechBHandler: PanelDataHandler,
) => {
	speechBHandler.resetPanel();
	const mimeTye = "image/jpeg";

	for (const pFileNames in res) {
		const sb = res[pFileNames];
		const sbData = sb?.map((p) => {
			const blb = b64ToBlob(p.blob, mimeTye);
			return blobToFile(blb, p.filename, mimeTye, Date.now());
		});
		if (sbData) speechBHandler.addPanelGrp(pFileNames, sbData);
	}
};
