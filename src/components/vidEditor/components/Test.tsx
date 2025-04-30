import React, { createRef, useEffect, useMemo, useRef, useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import "./transition.css";
import "../../../index.css";
import useInterval from "../../../hooks/useInterval";
interface AudioInfoI {
	url: string;
	// Add other properties as needed
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

export interface SlideI {
	imageUrl: string;
	start: number;
	end: number;
}

export interface AudioSlidePreviewProps {
	audioTracks: AudioTrackI[];
	slides: SlideI[];
	fps?: number;
}

type FlatAudio = {
	start: number;
	end: number;
	trimStart: number;
	trimEnd: number;
	file: AudioInfoI;
};

const AudioSlidePreview: React.FC<AudioSlidePreviewProps> = ({
	audioTracks,
	slides,
}) => {
	const [curTime, setCurTime] = useState<number>(0);
	const [deviceFPS, setDeviceFPS] = useState<number>(0);
	const updateFPS = useRef<boolean>(false);
	const { start, stop, state } = useInterval();

	const [isPlaying, setIsPlaying] = useState<boolean>(false);
	const isPlayingRef = useRef<boolean>(isPlaying);
	const animId = useRef<number | null>(null);
	const lastFrameTime = useRef<number | null>(null);
	const audioNodesRef = useRef<HTMLAudioElement[]>([]);

	useEffect(() => {
		audioNodesRef.current = audioTracks
			.flatMap((d) => d.tracks)
			.map((d) => new Audio(d.file.url));

		return () => {
			audioNodesRef.current = [];
		};
	}, [audioTracks]);

	useEffect(() => {
		isPlayingRef.current = isPlaying;
	}, [isPlaying]);

	useEffect(() => {
		audiosPlayer(audioTracks, audioNodesRef.current, curTime, isPlaying);
		// return () => {
		// 	audioNodesRef.current = [];
		// };
	}, [audioTracks, audioNodesRef, isPlaying, curTime]);

	const tick = () => {
		console.log("tick");
		if (!lastFrameTime.current) {
			lastFrameTime.current = Date.now();
		}
		const delta = Date.now() - lastFrameTime.current; // time elapsed in each frame interval
		// dur / frameNum = delta
		// 1000 / frameNum = delta
		// frameNum = 1000 / delta
		if (updateFPS.current) {
			setDeviceFPS(1000 / delta);
			updateFPS.current = false;
		}
		if (isPlayingRef.current) {
			lastFrameTime.current += delta;
			setCurTime((s) => s + delta);

			window.requestAnimationFrame(tick);
		} else {
			return;
		}
	};

	// useEffect(() => {}, []);

	const togglePlay = () => {
		if (isPlaying) {
			// Stop Playing
			setIsPlaying(false);
			if (animId.current) window.cancelAnimationFrame(animId.current);
			stop();
			updateFPS.current = false;
		} else {
			// Start Playing
			setIsPlaying(true);
			// animId.current = window.requestAnimationFrame(tick);
			audiosPlayer(audioTracks, audioNodesRef.current, curTime, isPlaying);
			start(() => (updateFPS.current = true));
		}
	};

	return (
		<div className="audio-slide-preview">
			<div
				className="preview-container"
				style={{ width: "100%", height: "400px", backgroundColor: "#000" }}>
				{/* {currentSlide && (
					<img
						src={currentSlide.imageUrl}
						alt="Slide"
						style={{ width: "100%", height: "100%", objectFit: "contain" }}
					/>
				)} */}
			</div>

			<div className="controls">
				<button className="bg-blue-400 p-2 rounded-md m-2" onClick={togglePlay}>
					{isPlaying ? "Pause" : "Play"}
				</button>
				<button
					className="bg-blue-400 p-2 rounded-md m-2"
					onClick={() => {
						const a = new Audio(audioTracks[0].tracks[0].file.url);
						a.play();
					}}>
					Audio
				</button>
				{/* <button
					onClick={togglePlayPause}
					className="bg-violet-600 p-2 rounded-md m-2">
					{isPlaying ? "Pause" : "Play"}
				</button>
				<button
					className="bg-purple-700 p-2 rounded-md m-2"
					onClick={resetPlayback}>
					Reset
				</button> */}

				{/* <input
					type="range"
					min={0}
					max={duration}
					step={0.01}
					value={currentTime}
					onChange={(e) => seekTo(parseFloat(e.target.value))}
					style={{ width: "100%" }}
				/> */}

				<div className="text-purple-600">
					{Math.floor(curTime / 1000)} | FPS: {Math.floor(deviceFPS)} |{" "}
					{state ? "True" : "False"}
					{/* {currentTime.toFixed(2)} / {duration.toFixed(2)} */}
				</div>
				<div className="text-purple-600">{/* {currentTime} */}</div>
			</div>
			{/* <Subs /> */}
		</div>
	);
};

const findAudioIndxAtCurrTime = (
	curTime: number,
	audios: FlatAudio[],
): number[] => {
	const audioIndxs: number[] = [];
	audios.forEach((audio, i) => {
		if (
			Math.floor(curTime / 1000) > audio.start &&
			Math.floor(curTime / 1000) <= audio.end
		) {
			audioIndxs.push(i);
		}
	});
	return audioIndxs;
};

const audiosPlayer = (
	audioTracks: AudioTrackI[],
	audioNodes: HTMLAudioElement[],
	curTime: number,
	isPlaying: boolean,
) => {
	const fAudio = audioTracks.flatMap((d) => d.tracks);
	const idxs = findAudioIndxAtCurrTime(curTime, fAudio);

	audioNodes.forEach((d, i) => {
		if (!isPlaying && !d.paused) {
			d.pause();
		}
		if (idxs.indexOf(i) !== -1) {
			const seekTime = curTime / 1000 - fAudio[i].start;
			if (Math.floor(d.currentTime) !== Math.floor(seekTime)) {
				console.log(
					"playing again",
					fAudio[i].file.url,
					Math.floor(d.currentTime),
					Math.floor(seekTime),
				);
				if (d.paused) d.play();
				d.currentTime = seekTime;
			}
		} else {
			if (!d.paused) d.pause();
		}
	});
};

type CaptionData = {
	order: number;
	text: string;
	start: number; // seconds
	end: number; // seconds
	pos?: { x1: number; x2: number; y1: number; y2: number };
};
const parseMs = (txt: string): number => {
	const nums = txt.split(",");
	if (nums.length !== 2) {
		console.error(`cannot parse ms: ${txt}`);
		return 0;
	}
	return +nums[0] + +nums[1] / 1000;
};
const parseTimeStampPos = (
	txt: string,
): Pick<CaptionData, "pos" | "start" | "end"> | undefined => {
	// Parse Timestamp and position
	// 00:02:36,389 --> 00:02:39,290 X1:203 X2:511 Y1:359 Y2:431
	const tsPatrn =
		/(\d\d):(\d\d):(\d\d,\d\d\d) --> (\d\d):(\d\d):(\d\d,\d\d\d)( X1:\d+ X2:\d+ Y1:\d+ Y2:\d+)?/;

	if (!tsPatrn.test(txt)) {
		console.error(`Unable to parse: ${txt}`);
		return { start: 0, end: 0 };
	}
	const grps = tsPatrn.exec(txt);
	if (grps) {
		const start = +grps[1] * 60 * 60 + +grps[2] * 60 + parseMs(grps[3]);
		const end = +grps[4] * 60 * 60 + +grps[5] * 60 + parseMs(grps[6]);
		if (grps.length > 6) {
			//check position is present
			// TODO: Parse position
			return { start, end, pos: { x1: 0, x2: 0, y1: 0, y2: 0 } };
		} else {
			return { start, end };
		}
	}
};

const parseCaption = (caption: string): CaptionData[] => {
	const rowSep = caption.includes("\r\n") ? "\r\n" : "\n";
	const rows = caption.trim().split(rowSep);

	// Parse Caption
	const captionDatas: CaptionData[] = [];
	for (let i = 0; i < rows.length; i++) {
		const cap: string[] = [];
		do {
			cap.push(rows[i].trimEnd());
			i++;
		} while (i < rows.length && rows[i] !== "");
		const ts = parseTimeStampPos(cap[1]);
		captionDatas.push({
			order: +cap[0],
			text: cap.slice(2).join("<br/>"),
			start: ts?.start || 0,
			end: ts?.end || 0,
		});
	}
	console.log(captionDatas);
	return captionDatas;
};

const Subs = () => {
	const [timer, setTimer] = useState<number>(0);
	const [curIdxs, setCurIdxs] = useState<number[]>([]);
	const [captions, setCaptions] = useState<
		(CaptionData & { nodeRef: React.RefObject<HTMLDivElement> })[]
	>([]);
	const { start, stop } = useInterval(500);
	const [dur, setDur] = useState<number>(0);

	useEffect(() => {
		(async () => {
			const res = await fetch("/Comic2Video/caption1.srt");
			const d = await res.text();
			const datum = parseCaption(d);
			setCaptions(
				datum.map((d) => ({ ...d, nodeRef: createRef<HTMLDivElement>() })),
			);
			const capMaxEnd = datum.reduce((acc, d) => Math.max(d.end, acc), -1);
			setDur(capMaxEnd + 2);
		})();
	}, []);

	// const captions = useMemo(
	// 	() => [
	// 		{
	// 			text: "this is some caption0",
	// 			start: 0,
	// 			end: 5,
	// 			nodeRef: createRef<HTMLDivElement>(),
	// 		},
	// 		{
	// 			text: "this is some caption1",
	// 			start: 5,
	// 			end: 8,
	// 			nodeRef: createRef<HTMLDivElement>(),
	// 		},
	// 		{
	// 			text: "this is some caption2",
	// 			start: 8,
	// 			end: 14,
	// 			nodeRef: createRef<HTMLDivElement>(),
	// 		},
	// 		{
	// 			text: "this is some caption3",
	// 			start: 9,
	// 			end: 14,
	// 			nodeRef: createRef<HTMLDivElement>(),
	// 		},
	// 		{
	// 			text: "this is some caption4",
	// 			start: 14,
	// 			end: 18,
	// 			nodeRef: createRef<HTMLDivElement>(),
	// 		},
	// 	],
	// 	[], // no dependencies
	// );

	const findCurCaptionIndxs = (
		curTime: number,
		captions: { text: string; start: number; end: number }[],
	): number[] => {
		const indxs: number[] = [];
		captions.forEach((d, i) => {
			if (d.start < curTime && d.end >= curTime) {
				indxs.push(i);
			}
		});
		return indxs;
	};

	useEffect(() => {
		start(() => setTimer((t) => t + 0.5));
		return () => {
			stop();
		};
	}, [start, stop, dur]);

	useEffect(() => {
		setCurIdxs(findCurCaptionIndxs(timer, captions));
		if (timer >= dur) {
			stop();
		}
		return () => {
			setCurIdxs([]);
		};
	}, [timer, stop, captions, dur]);

	return (
		<div className="w-[20rem] h-[20rem] bg-orange-500/30 backdrop-blur-md rounded-md p-2 relative">
			<div className="text-black">
				Len: {curIdxs.length}, idxs: {curIdxs} <br />
				Time: {timer} / {dur}
			</div>

			<TransitionGroup className="absolute bottom-0 mx-auto">
				{curIdxs.map((idx, i) => {
					return (
						<CSSTransition
							key={i}
							nodeRef={captions[idx].nodeRef}
							timeout={500}
							classNames="item">
							<div
								dangerouslySetInnerHTML={{ __html: captions[idx].text }}
								className="border p-1 rounded bg-slate-700 text-teal-50"
								ref={captions[idx].nodeRef}
							/>
							{/* {captions[idx].text} */}
							{/* </div> */}
						</CSSTransition>
					);
				})}
			</TransitionGroup>
		</div>
	);
};

const _AudioSlidePreview: React.FC<AudioSlidePreviewProps> = ({ slides }) => {
	const slidesR = [...slides, ...slides, ...slides, ...slides, ...slides];
	return (
		<div className="small-scroll relative flex flex-row flex-nowrap flex-none overflow-auto gap-2 rounded-md border border-rose-500 items-center">
			<div className="sticky top-0 left-0 h-[12rem] w-[12rem] bg-orange-300/30 rounded-md backdrop-blur-md">
				<div className="relative flex items-center h-[12rem] w-[12rem] justify-center p-1">
					<img
						src={`/Comic2Video/19.jpg`}
						alt="test-abs"
						className="h-[11rem] rounded"
					/>
				</div>
			</div>
			{/* <div className="relative h-[12rem] min-w-[12rem]"></div> */}
			{slidesR.map((d, i) => (
				<div key={i} className="border border-violet-500 rounded-md grow-0">
					<img
						src={`${d.imageUrl}`}
						alt={`${d.imageUrl}`}
						className="h-[8rem] min-w-[8rem] rounded-md"
					/>
				</div>
			))}
		</div>
	);
};

export default AudioSlidePreview;
