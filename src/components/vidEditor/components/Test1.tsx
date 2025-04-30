import React, {
	useState,
	useEffect,
	useRef,
	useCallback,
	useMemo,
	createRef,
} from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";

import "./transition.css";

interface FlatAudio {
	start: number;
	end: number;
	trimStart: number;
	trimEnd: number;
	file: {
		url: string;
	};
}

export interface AudioTracksI {
	tracks: FlatAudio[];
}

interface SlideTrackI {
	start: number;
	end: number;
	file: {
		imageUrl: string;
	};
}
export interface SlideTracksI {
	tracks: SlideTrackI[];
}

export interface CaptionTracksI {
	file: { url: string };
}

interface AudioSlidePreviewProps {
	audioTracks: AudioTracksI[];
	slideTracks: SlideTracksI[];
	captionTracks: CaptionTracksI[];
	duration: number;
}

/**
 * Component that synchronizes audio tracks with slides in a presentation preview
 */
const AudioSlidePreview: React.FC<AudioSlidePreviewProps> = ({
	audioTracks,
	slideTracks,
	captionTracks,
	duration,
}) => {
	// State management
	const [currentTime, setCurrentTime] = useState<number>(10);
	const [fps, setFps] = useState<number>(0);
	const [isPlaying, setIsPlaying] = useState<boolean>(false);

	// Captions
	const [captionTxt, setCaptionTxt] = useState<string[]>([]);

	// Refs for values that need persistence between renders
	const audioNodesRef = useRef<HTMLAudioElement[]>([]);
	const rafId = useRef<number | null>(null);
	const lastFrameTimeRef = useRef<number | null>(null);
	const fpsUpdateTimeRef = useRef<number>(0);

	// fetch Caption Content
	useEffect(() => {
		setCaptionTxt((d) => {
			d = [];
			captionTracks.forEach(async (c) => {
				try {
					const res = await fetch(c.file.url);
					const txt = await res.text();
					d.push(txt);
				} catch (err) {
					console.error("Error fetching caption", err);
				}
			});
			return d;
		});
	}, [captionTracks]);

	// Initialize audio nodes when tracks change
	useEffect(() => {
		// Clean up previous audio elements
		audioNodesRef.current.forEach((audio) => {
			audio.pause();
			audio.src = "";
		});

		// Create new audio elements
		const flattenedTracks = audioTracks.flatMap((track) => track.tracks);
		audioNodesRef.current = flattenedTracks.map(
			(track) => new Audio(track.file.url),
		);

		// Clean up on unmount
		return () => {
			audioNodesRef.current.forEach((audio) => {
				audio.pause();
				audio.src = "";
			});
			audioNodesRef.current = [];
		};
	}, [audioTracks]);

	/**
	 * Handle animation frame updates for playback
	 */
	const animationTick = useCallback(() => {
		const now = Date.now();
		console.log(currentTime / 1000, duration);
		if (currentTime / 1000 > duration) {
			console.log("triggg ");
			setIsPlaying(false);
			return;
		}

		if (
			!lastFrameTimeRef.current &&
			isPlaying &&
			currentTime / 1000 <= duration
		) {
			lastFrameTimeRef.current = now;
			rafId.current = requestAnimationFrame(animationTick);
			return;
		}

		const delta = now - lastFrameTimeRef.current;
		lastFrameTimeRef.current = now;

		// Update FPS approximately once per second
		if (now - fpsUpdateTimeRef.current > 1000) {
			setFps(1000 / delta);
			fpsUpdateTimeRef.current = now;
		}

		// Update time and synchronize audio
		setCurrentTime((prevTime) => {
			const newTime = prevTime + delta;
			syncAudioWithTime(newTime);
			// Stop animation
			if (newTime / 1000 > duration) {
				cancelAnimationFrame(rafId.current);
				setIsPlaying(false);
			}
			return newTime;
		});

		// Continue animation loop if still playing
		if (isPlaying && currentTime / 1000 <= duration) {
			rafId.current = requestAnimationFrame(animationTick);
		}
	}, [isPlaying]);

	/**
	 * Synchronize audio nodes with the current playback time
	 */
	const syncAudioWithTime = useCallback(
		(time: number) => {
			const flattenedTracks = audioTracks.flatMap((track) => track.tracks);
			const timeInSeconds = time / 1000;

			flattenedTracks.forEach((track, index) => {
				const audio = audioNodesRef.current[index];
				const isActiveTrack =
					timeInSeconds > track.start && timeInSeconds <= track.end;

				if (isActiveTrack) {
					const seekTime = timeInSeconds - track.start;

					// Only adjust time if it's significantly different (prevent unnecessary seeking)
					if (Math.abs(audio.currentTime - seekTime) > 0.2) {
						audio.currentTime = seekTime;
					}

					if (audio.paused && isPlaying) {
						audio
							.play()
							.catch((err) => console.error("Error playing audio:", err));
					}
				} else if (!audio.paused) {
					audio.pause();
				}
			});
		},
		[audioTracks, isPlaying],
	);

	/**
	 * Start/stop playback when isPlaying changes
	 */
	useEffect(() => {
		if (isPlaying) {
			// Start animation loop
			lastFrameTimeRef.current = Date.now();
			rafId.current = requestAnimationFrame(animationTick);

			// Ensure audio is synchronized
			// syncAudioWithTime(currentTime);
		} else {
			// Stop animation loop
			if (rafId.current) {
				cancelAnimationFrame(rafId.current);
				rafId.current = null;
			}

			// Pause all audio
			audioNodesRef.current.forEach((audio) => {
				if (!audio.paused) audio.pause();
			});
		}

		// Clean up on unmount
		return () => {
			if (rafId.current) {
				cancelAnimationFrame(rafId.current);
				rafId.current = null;
			}
		};
	}, [isPlaying, animationTick, currentTime, syncAudioWithTime]);

	/**
	 * Toggle playback state
	 */
	const togglePlay = useCallback(() => {
		setIsPlaying((prevState) => !prevState);
	}, []);

	/**
	 * Reset playback to beginning
	 */
	const resetPlayback = useCallback(() => {
		setCurrentTime(0);
		setIsPlaying(false);

		audioNodesRef.current.forEach((audio) => {
			audio.pause();
			audio.currentTime = 0;
		});
	}, []);

	/**
	 * Seek to a specific time
	 */
	const seekTo = useCallback(
		(time: number) => {
			setCurrentTime(time);
			syncAudioWithTime(time);
		},
		[syncAudioWithTime],
	);

	// Format time display (MM:SS)
	const formatTime = (timeMs: number): string => {
		const seconds = Math.floor(timeMs / 1000);
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
	};

	return (
		<div className="audio-slide-preview">
			<div className="relative rounded-md bg-black w-full h-[400px] border border-green-500">
				<div className="relative mx-auto h-[400px] w-[400px] flex items-center justify-center bg-white border border-blue-500">
					{getCurrentSlides(slideTracks, currentTime / 1000).map((idx, i) => {
						if (idx !== -1) {
							const slide = slideTracks[i].tracks[idx];
							return (
								<img
									key={i}
									src={`${slide.file.imageUrl}`}
									alt={`Slide ${i}`}
									className="absolute top-0 left-0 right-0 bottom-0 m-auto max-w-full max-h-full object-contain"
									style={{
										zIndex: i, // Higher tracks appear on top
										opacity: 1, // You can adjust opacity if needed
									}}
								/>
							);
						} else {
							return null;
						}
					})}
					{/* Display Caption */}
					<div className="absolute bottom-0 mx-auto z-[99]">
						{captionTxt.map((d, i) => (
							<SubPreview key={i} time={currentTime} captionText={d} />
						))}
					</div>
				</div>
			</div>

			<div className="controls flex flex-col gap-2 mt-3">
				<div className="flex items-center gap-2">
					<button
						className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors"
						onClick={togglePlay}
						aria-label={isPlaying ? "Pause" : "Play"}>
						{isPlaying ? "Pause" : "Play"}
					</button>

					<button
						className="bg-gray-500 hover:bg-gray-600 text-white p-2 rounded-md transition-colors"
						onClick={resetPlayback}
						aria-label="Reset">
						Reset
					</button>
				</div>

				<div className="flex items-center gap-2 w-full">
					<span className="text-sm w-16 text-purple-500">
						{formatTime(currentTime)}
					</span>

					<input
						type="range"
						min={0}
						max={duration}
						step={0.1}
						value={currentTime / 1000}
						onChange={(e) => seekTo(parseFloat(e.target.value) * 1000)}
						className="w-full"
						aria-label="Playback position"
					/>

					<span className="text-sm w-16 text-purple-500">
						{formatTime(duration * 1000)}
					</span>
				</div>

				<div className="text-xs text-gray-500">FPS: {Math.floor(fps)}</div>
			</div>
		</div>
	);
};

export default AudioSlidePreview;

/** Return the indexes of slides that need to be displayed according to their timestamp
 *
 * Return: [1, 3, 0, -1] // render slide indx 1 in track 0, slide indx 3 in track 1, slide indx 0 in track 2 over one another
 * for track 3, no matching slide is found
 *
 * Assumption: In a single track no two slides willl collide/overlay,
 * if collision is found in the same track only the first slide will be returned
 */
const getCurrentSlides = (
	slideTracks: SlideTracksI[],
	time: number,
): number[] => {
	const idxs: number[] = [];
	slideTracks.forEach((track) => {
		const idx = track.tracks.findIndex((t) => t.start < time && t.end >= time);
		idxs.push(idx);
	});
	return idxs;
};

// Captions
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
	console.log("parse caption called");
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

	return captionDatas;
};

const SubPreview: React.FC<{ captionText: string; time: number }> = ({
	captionText,
	time,
}) => {
	const captionData = useMemo(
		() =>
			parseCaption(captionText).map((d) => ({
				...d,
				nodeRef: createRef<HTMLDivElement>(),
			})),
		[captionText],
	);

	return (
		<TransitionGroup className="h-fit w-fit">
			{captionData
				.filter((d) => d.start < time / 1000 && d.end >= time / 1000)
				.map((d, i) => {
					return (
						<CSSTransition
							key={i}
							nodeRef={d.nodeRef}
							timeout={500}
							classNames="item">
							<div
								dangerouslySetInnerHTML={{ __html: d.text }}
								className="rounded bg-slate-700/80 text-teal-50"
								ref={d.nodeRef}
							/>
						</CSSTransition>
					);
				})}
		</TransitionGroup>
	);
};
