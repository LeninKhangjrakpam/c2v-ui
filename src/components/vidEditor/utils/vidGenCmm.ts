import { ImageInfoI, VidSettingType } from "../components/editor/type";
import {
	AudioTrackI,
	CaptionI,
	PanelTrackI,
	SpeechBubbleTrackI,
} from "../components/editor/type";
import { resolutionMap } from "./constants";

const imgInpSubCmm = (duration: number, file: ImageInfoI): string[] => {
	return ["-loop", "1", "-t", duration.toString(), "-i", file.name];
};

const resizeComm = (mode: string, dims: [number, number]): string => {
	switch (mode) {
		case "maintain aspect ratio":
			return `:force_original_aspect_ratio=decrease,pad=${dims[0]}:${dims[1]}:(ow-iw)/2:(oh-ih)/2`;
		case "stretch":
			return "";
		default:
			return "";
	}
};

const getDim = (
	resolution: number,
	orientation: "landscape" | "portrait",
): [number, number] => {
	const [width, height] = resolutionMap[resolution];
	return orientation === "landscape" ? [width, height] : [height, width];
};

const imgResizeSubCmm = (
	indx: number,
	orientation: "landscape" | "portrait",
	resolution: number,
	resizeMode: string,
): string => {
	const dim = getDim(resolution, orientation);

	return `[${indx}]scale=${dim[0]}:${dim[1]}${resizeComm(
		resizeMode,
		dim,
	)},setsar=1[i${indx}];`;
};
const overlaySubCmm = (panelTrackDatas: PanelTrackI[]) => {
	return ``;
};

export const vidGenCmm1 = (
	vidSettingConfig: VidSettingType,
	panelTrackDatas: PanelTrackI[],
	speechBubbleTracksDatas: SpeechBubbleTrackI[],
	audioTrackDatas: AudioTrackI[],
	caption: CaptionI,
): string[] => {
	const outputFName = "output.mp4";

	const [width, height] = getDim(
		vidSettingConfig.resolution,
		vidSettingConfig.orientation,
	);
	const cmnd: string[] = [
		"-y",
		"-f",
		"lavfi", // lib
		"-t",
	];

	// Set duration
	cmnd.push(vidSettingConfig.duration.toString());
	// Set background color, resolution, frameRate
	cmnd.push(
		"-i",
		`color=c=${vidSettingConfig.vidBackground}:s=${width}x${height}:r=${vidSettingConfig.frameRate}`,
	);
	const inputs: string[] = [];
	const filters: string[] = []; // filter for images
	const overlayComd: string[] = []; // create overlay for images
	let fI = 0;
	panelTrackDatas.forEach((tracks) => {
		tracks.tracks.forEach((tr) => {
			inputs.push(
				...[
					"-loop",
					"1",
					"-t",
					`${tr.end - tr.start}`,
					"-i",
					`${tr.file.name}`,
				],
			);
			filters.push(
				`[${
					fI + 1
				}]scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,setsar=1[i${
					fI + 1
				}];`,
			);
			overlayComd.push(
				`[${fI === 0 ? `${fI}` : `v${fI}`}][i${
					fI + 1
				}]overlay=enable='between(t,${tr.start},${tr.end})'[v${fI + 1}];`,
			);
			fI++;
		});
	});
	// Change last overlay output
	const lastOverlayComnd = overlayComd[overlayComd.length - 1];
	overlayComd[overlayComd.length - 1] =
		lastOverlayComnd.slice(0, lastOverlayComnd.length - `[v${fI}]`.length - 1) +
		`[v];`;

	// Audio Filter
	fI++;
	let audioFilterComnd = "";
	let lastAudioFilterComnd = "";

	let aI = 1;
	audioTrackDatas.forEach((aTrack, tIndx) => {
		aTrack.tracks.forEach((aTr, aIndx) => {
			inputs.push(...["-i", aTr.file.name]);
			audioFilterComnd += `[${fI}]atrim=start=${aTr.trimStart}:end=${
				aTr.trimEnd
			},adelay=${Math.round(aTr.start * 1000)}|${Math.round(
				aTr.start * 1000,
			)}[a${aI}_trimmed];`;
			lastAudioFilterComnd += `[a${aI}_trimmed]`;
			aI++;
			fI++;
		});
	});
	lastAudioFilterComnd += `amix=inputs=${aI - 1}[a]`;

	cmnd.push(...inputs);
	// cmnd.push(...filters);
	// cmnd.push(...overlayComd);
	cmnd.push("-filter_complex");
	cmnd.push(
		filters.join("") +
			overlayComd.join("") +
			audioFilterComnd +
			lastAudioFilterComnd,
	);

	const decoderCmd: string[] = [
		"-map",
		"[v]",
		"-map",
		"[a]",
		"-c:v",
		"libx264",
		"-c:a",
		"aac",
		"-pix_fmt",
		"yuva420p",
		"-r",
		`${vidSettingConfig.frameRate}`,
		"-t",
		`${vidSettingConfig.duration}`,
		`${outputFName}`,
	];

	cmnd.push(...decoderCmd);

	return cmnd;
};

const vidGenCmm = (
	vidSettingConfig: VidSettingType,
	panelTrackDatas: PanelTrackI[],
	speechBubbleTracksDatas: SpeechBubbleTrackI[],
	audioTrackDatas: AudioTrackI[],
	caption: CaptionI,
): string[] => {
	const [width, height] = getDim(
		vidSettingConfig.resolution,
		vidSettingConfig.orientation,
	);
	const cmm = ["-y", "-f", "lavfi", "-t"];
	// Set duration
	cmm.push(vidSettingConfig.duration.toString());
	// Set background color, resolution, frameRate
	cmm.push(
		"-i",
		`color=c=${vidSettingConfig.vidBackground}:s=${width}x${height}:r=${vidSettingConfig.frameRate}`,
	);
	const imgInps = panelTrackDatas.flatMap((pDatas) =>
		pDatas.tracks.reduce(
			(acc, pData) => [
				...acc,
				...imgInpSubCmm(pData.end - pData.start, pData.file),
			],
			[] as string[],
		),
	);
	cmm.push(...imgInps);

	// Image Resize Command
	cmm.push("-filter_complex");
	const panelDataImgFNames = panelTrackDatas.flatMap((pDatas) =>
		pDatas.tracks.map((t) => t.file.name),
	);
	const imgResizeCmm = panelDataImgFNames.reduce(
		(acc, _, i) =>
			acc +
			imgResizeSubCmm(
				i + 1,
				vidSettingConfig.orientation,
				vidSettingConfig.resolution,
				vidSettingConfig.resizeMode,
			),
		"",
	);
	cmm.push(imgResizeCmm);
	// Image Overlay Command
	let ctr = 0;
	const overlayCmm = "";
	return cmm;
};
