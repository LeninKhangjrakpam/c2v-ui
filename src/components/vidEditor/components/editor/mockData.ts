import {
	InputData,
	PanelData,
	SpeechBubbleData,
	SpeechData,
} from "../../../inputData.type";
import {
	ImageInfoI,
	AudioInfoI,
	PanelTrackI,
	SpeechBubbleTrackI,
	AudioTrackI,
	CaptionTrackI,
} from "./type";

// Mock Data
const imgs: string[] = Array.from({ length: 2 }).map((_, i) => `${i + 1}.png`);
// const audios = [
// 	{ name: "1.wav", len: 9 },
// 	{ name: "2.wav", len: 16 },
// 	{ name: "3.wav", len: 56 },
// 	{ name: "4.wav", len: 55 },
// ];

export const CaptionDatas: CaptionTrackI = {
	name: "caption.srt",
	url: "/caption.srt",
};

export const totalTrackTime = 30; // seconds

export const PanelDatas: PanelTrackI[] = [
	{
		trackName: "Track0",
		tracks: [
			{
				start: 0,
				end: 3,
				file: {
					name: "1.png",
					url: `/1.png`,
					width: 100,
					height: 100,
					size: 100 * 100,
				} as ImageInfoI,
			},
			{
				start: 3,
				end: 6,
				file: {
					name: "2.png",
					url: `/2.png`,
					width: 100,
					height: 100,
					size: 100 * 100,
				} as ImageInfoI,
			},
			{
				start: 6,
				end: 10,
				file: {
					name: "3.png",
					url: `/3.png`,
					width: 100,
					height: 100,
					size: 100 * 100,
				} as ImageInfoI,
			},
		],
	},
	{
		trackName: "Track1",
		tracks: [
			{
				start: 4,
				end: 8,
				file: {
					name: "4.png",
					url: `/4.png`,
					width: 100,
					height: 100,
					size: 100 * 100,
				} as ImageInfoI,
			},
		],
	},
	{
		trackName: "Track2",
		tracks: [
			{
				start: 10,
				end: 15,
				file: {
					name: "5.png",
					url: `/5.png`,
					width: 100,
					height: 100,
					size: 100 * 100,
				} as ImageInfoI,
			},
		],
	},
	{
		trackName: "Track2",
		tracks: [
			{
				start: 10,
				end: 15,
				file: {
					name: "5.png",
					url: `/5.png`,
					width: 100,
					height: 100,
					size: 100 * 100,
				} as ImageInfoI,
			},
		],
	},
	{
		trackName: "Track2",
		tracks: [
			{
				start: 10,
				end: 15,
				file: {
					name: "5.png",
					url: `/5.png`,
					width: 100,
					height: 100,
					size: 100 * 100,
				} as ImageInfoI,
			},
		],
	},
];

export const _PanelDatas: PanelTrackI[] = Array.from({ length: 2 }).map(
	(_, i) => {
		const trackNum = 1 + Math.floor(Math.random() * 5);
		const tracks = Array.from({ length: 2 }).map((_, trI) => {
			const trackDuration =
				2 +
				Math.floor(Math.random() * (Math.floor(totalTrackTime / trackNum) - 2));
			const start =
				trI * Math.floor(totalTrackTime / trackNum) +
				Math.floor(Math.random() * 2);
			const end = start + trackDuration;
			const img = imgs[Math.floor(Math.random() * imgs.length)];
			return {
				start,
				end,
				file: {
					name: img,
					url: `/${img}`,
					width: 100,
					height: 100,
					size: 100 * 100,
				} as ImageInfoI,
			};
		});
		return {
			trackName: `Panel${i}`,
			tracks,
		};
	},
);

export const SpeechBubbleDatas: SpeechBubbleTrackI[] = Array.from({
	length: 2,
}).map((_, i) => {
	const trackNum = 1 + Math.floor(Math.random() * 5);
	const tracks = Array.from({ length: trackNum }).map((_, trI) => {
		const trackDuration =
			2 +
			Math.floor(Math.random() * (Math.floor(totalTrackTime / trackNum) - 2));
		const start =
			trI * Math.floor(totalTrackTime / trackNum) +
			Math.floor(Math.random() * 2);
		const end = start + trackDuration;
		const img = imgs[Math.floor(Math.random() * imgs.length)];
		return {
			start,
			end,
			file: {
				name: img,
				url: `/${img}`,
				width: 100,
				height: 100,
				size: 100 * 100,
			} as ImageInfoI,
		};
	});
	return {
		trackName: `SpeechBubble${i}`,
		tracks,
	};
});

// { name: "1.wav", len: 9 },
// { name: "2.wav", len: 16 },
// { name: "3.wav", len: 56 },
// { name: "4.wav", len: 55 },

export const AudioDatas: AudioTrackI[] = [
	{
		trackName: `Audio0`,
		tracks: [
			{
				start: 0,
				end: 6,
				trimStart: 0,
				trimEnd: 6,
				file: {
					url: "/1.wav",
					name: "1.wav",
					len: 6,
					size: 1,
				} as AudioInfoI,
			},
		],
	},
	{
		trackName: `Audio1`,
		tracks: [
			{
				start: 3,
				end: 3 + 6,
				trimStart: 0,
				trimEnd: 6,
				file: {
					url: "/2.wav",
					name: "2.wav",
					len: 6,
					size: 1,
				} as AudioInfoI,
			},
		],
	},
	{
		trackName: `Audio2`,
		tracks: [
			{
				start: 10,
				end: 10 + 6,
				trimStart: 0,
				trimEnd: 6,
				file: {
					url: "/3.wav",
					name: "3.wav",
					len: 6,
					size: 1,
				} as AudioInfoI,
			},
		],
	},
	{
		trackName: `Audio3`,
		tracks: [
			{
				start: 0,
				end: 10,
				trimStart: 0,
				trimEnd: 10,
				file: {
					url: "/4.wav",
					name: "4.wav",
					len: 10,
					size: 1,
				} as AudioInfoI,
			},
		],
	},
	{
		trackName: `Audio3`,
		tracks: [
			{
				start: 0,
				end: 10,
				trimStart: 0,
				trimEnd: 10,
				file: {
					url: "/4.wav",
					name: "4.wav",
					len: 10,
					size: 1,
				} as AudioInfoI,
			},
		],
	},
];

// TODO: add watermark to bottom right
export const initDataLoader = (
	datas: HData[],
): {
	panelTrack: PanelTrackI;
	speechBubbleTrack: SpeechBubbleTrackI;
	audioTrack: AudioTrackI;
} => {
	const panelTrack: PanelTrackI = {
			trackName: "Panel1",
			tracks: [],
		},
		speechBubbleTrack: SpeechBubbleTrackI = {
			trackName: "Bubble1",
			tracks: [],
		},
		audioTrack: AudioTrackI = {
			trackName: "Audio1",
			tracks: [],
		};

	const panelStartPad = 0,
		panelEndPad = 1;
	const audioMargin = 1;

	// Fill up Panel Track according to Audio Len
	let panelStart = 0; // seconds
	const minPanelLen = 3; // seconds
	datas.forEach((d, i) => {
		let panelLen = d.sb.reduce((acc, s) => acc + s.audioLen + audioMargin, 0); // len of a single panel

		panelLen = panelLen === 0 ? minPanelLen : panelLen; // if panel have no sb, displayed for minPanelLen
		const panelDur = panelLen + panelStartPad + panelEndPad;

		const start = panelStart,
			end = panelStart + panelDur;

		panelTrack.tracks.push({
			start,
			end,
			file: {
				name: `P${i}`,
				url: d.panel.url,
				width: 0,
				height: 0,
				size: 0,
			},
		});

		let sbStart = panelStart,
			audioStart = panelStart;
		d.sb.forEach((sbI, sbIndx) => {
			// Fill SpeechBubble Track
			speechBubbleTrack.tracks.push({
				start: sbStart,
				end: sbStart + sbI.audioLen + audioMargin,
				file: {
					name: `SB-P${i}:S${sbIndx}`,
					url: sbI.sbData.url,
					width: 0,
					height: 0,
					size: 0,
				},
			});
			sbStart += sbI.audioLen + audioMargin;

			// Fill Audio Track
			if (sbI.audio) {
				audioTrack.tracks.push({
					start: audioStart,
					end: audioStart + sbI.audioLen,
					trimStart: 0,
					trimEnd: sbI.audioLen,
					file: {
						url: sbI.audio.url!,
						name: sbI.audioText,
						len: sbI.audioLen,
						size: 0,
					},
				});
			}
			audioStart += sbI.audioLen + audioMargin;

			panelStart = end;
		});
	});

	// TODO: watermark track, background music track

	return {
		panelTrack,
		speechBubbleTrack,
		audioTrack,
	};
};

type HData = {
	panelName: string;
	panel: InputData;
	sb: {
		sbName: string;
		sbData: InputData;
		audio: InputData | null;
		audioText: string;
		audioLen: number;
	}[];
};

export const assetDataFormatter = (
	panels: PanelData[],
	sb: SpeechBubbleData[],
	sbD: SpeechData[],
): HData[] => {
	const datas: HData[] = [];

	const fPanels = panels.flatMap((page) =>
		page.panels.map((panel) => ({
			pageName: page.pageFileName,
			panelName: panel.name,
			panel: panel,
		})),
	);

	fPanels.forEach((panel) =>
		datas.push({ panelName: panel.panelName, panel: panel.panel, sb: [] }),
	);

	datas.forEach((d) => {
		const sbI = sb.find((s) => s.panelFileName === d.panelName);

		console.log(sbD[0]);

		if (sbI && sbI.speechBubbles.length !== 0) {
			const sbs = sbI.speechBubbles.map((s) => {
				return {
					sbName: s.name,
					sbData: s,
					audio:
						sbD.find(
							(sbDI) =>
								sbDI.panelFileName === d.panelName &&
								sbDI.speechBubbleFileName === s.name,
						)?.audio ?? null,
					audioText:
						sbD.find(
							(sbDI) =>
								sbDI.panelFileName === d.panelName &&
								sbDI.speechBubbleFileName === s.name,
						)?.text ?? "",
					audioLen:
						sbD.find(
							(sbDI) =>
								sbDI.panelFileName === d.panelName &&
								sbDI.speechBubbleFileName === s.name,
						)?.audioLen ?? 0,
				};
			});

			d.sb = sbs;

			// if speechBubble is present and no corresponding audio of its present,
			// will happen if OCR failed to detect text from speechBubble
			// or text with no sound: `!?!` or picture in speech bubble
		}
	});

	return datas;
};
