import { blobToFile, getUUID } from "../../../../utils/util";
import {
	InputData,
	PanelData,
	SpeechBubbleData,
	SpeechData,
} from "../../../inputData.type";

export const assetInit = async () => {
	const { file: pageFile, objURL: pageURL } = await fetchAndConvertToFile(
		"/mocks/pages/ef1a5db0-b3e8-4757-ad31-81f85710f829.png",
		"ef1a5db0-b3e8-4757-ad31-81f85710f829.png",
		"image/png",
	);
	const pages: InputData[] = [
		{
			file: pageFile,
			name: "ef1a5db0-b3e8-4757-ad31-81f85710f829.png",
			url: pageURL,
			id: getUUID(),
			type: "image/png",
			size: pageFile.size,
			lastModified: new Date(),
		},
	];

	const panelUrls = [
		{
			url: "/mocks/panels/61d6d53d887f7872be676d196a954b4578dc41e22e21e3bb63e74455ae7fce4f.png",
			fileName:
				"61d6d53d887f7872be676d196a954b4578dc41e22e21e3bb63e74455ae7fce4f.png",
		},
		{
			url: "/mocks/panels/88e4b65cac181236f2c7f6bda2e12dc3b06e6030fb478844d902da08cb4e4c1b.png",
			fileName:
				"88e4b65cac181236f2c7f6bda2e12dc3b06e6030fb478844d902da08cb4e4c1b.png",
		},
		{
			url: "/mocks/panels/f2b4c268b29f7de3e34b20378765a1de4b7b8588cf572b70e7987c92756b5e47.png",
			fileName:
				"f2b4c268b29f7de3e34b20378765a1de4b7b8588cf572b70e7987c92756b5e47.png",
		},
	];

	const speechBUrls = [
		"/mocks/sb/61d6d53d887f7872be676d196a954b4578dc41e22e21e3bb63e74455ae7fce4f/748dfbde-a429-4c71-a38b-ea0a858823ec.png",
		"/mocks/sb/88e4b65cac181236f2c7f6bda2e12dc3b06e6030fb478844d902da08cb4e4c1b/2decee38-6894-4c79-8b36-6e703a3b38d6.png",
		"/mocks/sb/f2b4c268b29f7de3e34b20378765a1de4b7b8588cf572b70e7987c92756b5e47/8b0a2a8c-5f43-492b-bf9b-1a0222148f87.png",
		"/mocks/sb/f2b4c268b29f7de3e34b20378765a1de4b7b8588cf572b70e7987c92756b5e47/c5bba506-4cf1-452f-aa6a-646bdc7c8cde.png",
	];

	const panels: PanelData[] = [
		{
			pageFileName: "ef1a5db0-b3e8-4757-ad31-81f85710f829.png",
			panels: [],
		},
	];
	const speechBubbles: SpeechBubbleData[] = [];
	// const speechBubbles: SpeechBubbleData[] = [
	// 	{
	// 		panelFileName: "ef1a5db0-b3e8-4757-ad31-81f85710f829.png",
	// 		speechBubbles: [],
	// 	},
	// ];

	panelUrls.forEach(async (p) => {
		const { file: panelFile, objURL: panelURL } = await fetchAndConvertToFile(
			p.url,
			p.fileName,
			"image/png",
		);

		panels[0].panels.push({
			file: panelFile,
			name: p.fileName,
			url: panelURL,
			id: getUUID(),
			type: "image/png",
			size: panelFile.size,
			lastModified: new Date(),
		});
	});

	const sbs: { pnName: string; sbsName: { sbName: string; url: string }[] }[] =
		[];
	speechBUrls.forEach((s) => {
		const fpS = s.split("/");
		const pn = fpS[2],
			sb = fpS[3];
		const fIndx = sbs.findIndex((s) => s.pnName === pn);
		if (fIndx !== -1) {
			sbs[fIndx].sbsName.push({ sbName: sb, url: s });
		} else {
			sbs.push({ pnName: pn, sbsName: [{ sbName: sb, url: s }] });
		}
	});
	sbs.forEach((s) => {
		const sbsI: { file: File; url: string }[] = [];
		s.sbsName.forEach(async (sb) => {
			const { file, objURL } = await fetchAndConvertToFile(
				sb.url,
				sb.sbName,
				"image/png",
			);
			sbsI.push({ file, url: objURL });
		});
		speechBubbles.push({
			panelFileName: s.pnName,
			speechBubbles: sbsI.map(
				(sbsII) =>
					({
						file: sbsII.file,
						name: sbsII.file.name,
						url: sbsII.url,
						id: getUUID(),
						type: "image/png",
						size: sbsII.file.size,
						lastModified: new Date(sbsII.file.lastModified),
					} as InputData),
			),
		});
	});

	const rSpeechDatas = [
		{
			panelFileName:
				"61d6d53d887f7872be676d196a954b4578dc41e22e21e3bb63e74455ae7fce4f.png",
			speechBubbleFileName: "748dfbde-a429-4c71-a38b-ea0a858823ec.png",
			text: "THEY REACHED THE TEMPLE AND SPENT THE DAY WORSHIPPING LORD SHIVA ",
			audio: null,
			audioLen: 4,
			url: "/mocks/sd/61d6d53d887f7872be676d196a954b4578dc41e22e21e3bb63e74455ae7fce4f/7205a3bd-6fdb-499e-8085-e76643c0410f.mp3",
		},
		{
			panelFileName:
				"88e4b65cac181236f2c7f6bda2e12dc3b06e6030fb478844d902da08cb4e4c1b.png",
			speechBubbleFileName: "2decee38-6894-4c79-8b36-6e703a3b38d6.png",
			text: "ARYAMBA,TOMORROW WE SHALLSETOUT ON A PILGRIMAGE TO THE TEMPLEOF CHANDRAMOU LISHVARA AT TRICHUR. ",
			audio: null,
			audioLen: 13,
			url: "/mocks/sd/88e4b65cac181236f2c7f6bda2e12dc3b06e6030fb478844d902da08cb4e4c1b/5486c303-b667-43ac-a525-790936bb5159.mp3",
		},
		{
			panelFileName:
				"f2b4c268b29f7de3e34b20378765a1de4b7b8588cf572b70e7987c92756b5e47.png",
			speechBubbleFileName: "c5bba506-4cf1-452f-aa6a-646bdc7c8cde.png",
			text: "REVERED SIR,GIVE US THE ONE SON. ",
			audio: null,
			audioLen: 3,
			url: "/mocks/sd/f2b4c268b29f7de3e34b20378765a1de4b7b8588cf572b70e7987c92756b5e47/4a03bf35-f795-49b1-aa27-d4761ed95893.mp3",
		},
		{
			panelFileName:
				"f2b4c268b29f7de3e34b20378765a1de4b7b8588cf572b70e7987c92756b5e47.png",
			speechBubbleFileName: "8b0a2a8c-5f43-492b-bf9b-1a0222148f87.png",
			text: "THAT NIGHT.THEY WENT TOBED EARLYTIRED BUT CONTENT.STRANGETO SAY BOTH OF THEM HAD THE VERYSAME DREAM IN WHICH LORD SHIVA,DISGUISED AS A SAGE,APPEARED BEFORE THEM. YOU SHALL BE BLESSED WITH EITHER MANY ORDINARY SONS,OR ONE EXTRAORDINARY SON WHOWILL NOTLNE LONG.YOU MAY REVERED CHOOSE SIR,GIVE US THE ONESON REVERED ",
			audio: null,
			audioLen: 33,
			url: "/mocks/sd/f2b4c268b29f7de3e34b20378765a1de4b7b8588cf572b70e7987c92756b5e47/cd1ba882-10fa-4a45-894c-b8de6c58edbb.mp3",
		},
	];

	const speechDatas: SpeechData[] = [];
	rSpeechDatas.forEach(
		async ({ panelFileName, speechBubbleFileName, text, audioLen, url }) =>
			speechDatas.push({
				panelFileName,
				speechBubbleFileName,
				text,
				audioLen,
				audio: await urlToInputData(
					url,
					speechBubbleFileName.split(".").slice(0, -1).join(".") + ".mp3",
					"audio/mp3",
				),
			} as SpeechData),
	);

	return {
		pages,
		panels,
		speechBubbles,
		speechDatas,
	};
};

export const urlToInputData = async (
	url: string,
	fName: string,
	type: string,
): Promise<InputData> => {
	const { file, objURL } = await fetchAndConvertToFile(url, fName, type);
	return {
		file,
		name: file.name,
		url: objURL,
		id: getUUID(),
		type: file.type,
		size: file.size,
		lastModified: new Date(file.lastModified),
	};
};

export const fetchAndConvertToFile = async (
	url: string,
	fileName: string,
	fileType: string = "image/png",
): Promise<{ file: File; objURL: string }> => {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error("Failed to fetch file, url: " + url);
	}

	const blob = await response.blob();
	const file = blobToFile(blob, fileName, fileType);
	const objURL = URL.createObjectURL(blob);

	return { file, objURL };
};
