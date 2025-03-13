import { Eye, Trash, ZoomIn, ZoomOut } from "lucide-react";
import React, { useRef, useState } from "react";
import "../../index.css";
// import ContextMenu, { MenuItemI } from "./ContextMenu";
// import { Edit } from "lucide-react";
import {
	AudioTrackI,
	CaptionTrackI,
	PanelTrackI,
	SpeechBubbleTrackI,
} from "./type";
import XDraggable from "./XDraggable";
import { formatTime } from "../../utils/formatter";

export interface TimelinePropsI {
	previewMarkerTimeStamp: number;
	setPreviewMarkerTimeStamp: (timestamp: number) => void;
	duration: number; // in Seconds
	panelDatas: PanelTrackI[];
	movePanelTrackHandler: (
		panelId: number,
		trackId: number,
		newStartX: number,
	) => boolean;
	moveAudioTrackHandler: (
		audioId: number,
		trackId: number,
		newStartX: number,
	) => boolean;
	// setPanelDatas: React.Dispatch<React.SetStateAction<PanelTrackI[]>>;
	speechBubbleDatas: SpeechBubbleTrackI[];
	// setSpeechBubbleDatas: React.Dispatch<
	// 	React.SetStateAction<SpeechBubbleTrackI[]>
	// >;
	audioDatas: AudioTrackI[];
	// setAudioDatas: React.Dispatch<React.SetStateAction<AudioTrackI[]>>;
	caption: CaptionTrackI;
	// setCaption: React.Dispatch<React.SetStateAction<CaptionTrackI[]>>;
}

const Timeline = (props: TimelinePropsI) => {
	const [zoom, setZoom] = useState(0.35); // 1 means 1 second = 100px
	const duration = props.duration;
	// const [duration, setDuration] = useState(60); // Total duration in seconds
	// const [scrollPosition, setScrollPosition] = useState(0);
	// const containerRef = useRef(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const colors = ["bg-blue-200", "bg-red-200", "bg-green-200", "bg-yellow-200"];

	// Calculate timeline properties based on zoom
	const pixelsPerSecond = 100 * zoom;
	const totalWidth = duration * pixelsPerSecond;

	// Calculate visible time marks based on zoom level
	const getTimeMarks = (dur: number) => {
		const marks = [];
		// Adjust interval based on zoom level
		let interval = 1; // Default 1 second

		if (zoom < 0.2) interval = 10; // Show every 10 seconds
		else if (zoom < 0.5) interval = 5; // Show every 5 seconds
		else if (zoom < 1) interval = 2; // Show every 2 seconds

		for (let i = 0; i <= dur; i += interval) {
			marks.push({
				time: i,
				position: i * pixelsPerSecond,
			});
		}
		return marks;
	};

	const handleWheel = (e: React.WheelEvent) => {
		if (e.altKey) {
			const delta = e.deltaY > 0 ? 0.9 : 1.1;
			setZoom((prev) => Math.min(Math.max(prev * delta, 0.1), 5));
		} else {
			// Scroll horizontally
		}
	};

	return (
		<div className="w-full flex flex-col border border-green-500">
			{/* Zoom controls */}
			<div className="flex justify-between items-center p-2 bg-gray-100">
				<span className="text-sm">Zoom: {Math.round(zoom * 100)}%</span>

				<span>
					<select
						name="track"
						id="track-name"
						className="border rounded p-1 bg-inherit">
						{["All", "Panels", "Speech Bubbles", "Audios", "Captions"].map(
							(optn, i) => (
								<option key={i} value={optn}>
									{optn}
								</option>
							),
						)}
					</select>
				</span>

				<div className="flex flex-row justify-around gap-1">
					<button
						onClick={() => setZoom((prev) => Math.max(prev * 0.8, 0.1))}
						className="px-2 py-1 bg-white border rounded mr-2">
						<ZoomOut size={16} />
					</button>
					<div>{Math.round(zoom * 100)}%</div>
					<button
						onClick={() => setZoom((prev) => Math.min(prev * 1.2, 5))}
						className="px-2 py-1 bg-white border rounded">
						<ZoomIn size={16} />
					</button>
				</div>
			</div>

			{/* Tracks Control0 */}
			<div
				className="relative border rounded-md border-green-800 w-auto overflow-auto h-56 max-h-[30vh] scrollbar"
				// className="relative border rounded-md border-green-800 w-auto overflow-auto  max-h-full scrollbar"
				onWheel={handleWheel}
				ref={containerRef}>
				<div className="absolute left-0 top-0 h-7 w-40 rounded border font-bold text-md px-1 py-[0.2rem] bg-gray-300 z-[10]">
					Tracks
				</div>

				<div className="relative">
					{/* <div className="relative h-40 w-auto overflow-x-auto"> */}
					{/* Time Stamp */}
					<div
						className="ml-40 h-7  bg-white sticky top-0 z-[9] border-b-2 cursor-pointer select-none"
						style={{
							width: totalWidth,
						}}
						onClick={(e) => {
							if (containerRef && containerRef.current) {
								props.setPreviewMarkerTimeStamp(
									containerRef.current.scrollLeft / (zoom * 100) +
										(e.pageX - 165) / (zoom * 100),
								);
								console.log(containerRef.current.scrollLeft);
							}
						}}>
						{getTimeMarks(duration).map((mark, i, marks) => (
							<div
								key={mark.time}
								className="absolute bottom-0 flex flex-col items-center"
								style={{
									left: mark.position,
									transform: "translateX(-50%)",
								}}>
								<div className="h-2 w-px bg-gray-400" />
								<span className="text-xs text-gray-500">
									{i > 0 && i < marks.length - 1
										? formatTime(mark.time).slice(0, -4)
										: ""}
								</span>
							</div>
						))}
						{/* </div> */}

						{/* TimeStamp Marker */}
						<div className="sticky z-[10] top-0 w-fit">
							<div
								title={`${formatTime(props.previewMarkerTimeStamp)}`}
								className="relative transition-all"
								style={{
									left: props.previewMarkerTimeStamp * zoom * 100 - 16 / 2,
								}}>
								<div className="relative w-4 h-7 bg-red-600/80 rounded-t-sm">
									<div className="relative mx-auto top-0 w-[2px] h-56 bg-red-600/80"></div>
								</div>
								<div className="relative w-0 h-0 border-[0.5rem] border-t-red-600/80 border-b-transparent border-l-transparent border-r-transparent"></div>
							</div>
						</div>
					</div>
					{/* TrackList */}
					{/* Panel Tracks */}
					{props.panelDatas.map((tracks, panelId) => {
						return (
							<div
								className="relative h-7 flex flex-row flex-nowrap items-center hover:bg-slate-200"
								key={panelId}
								style={{
									width: totalWidth + 160,
								}}>
								<div className="border text-sm p-[0.2rem] w-40 min-w-40 sticky left-0 z-[1] bg-slate-300/10 backdrop-blur-lg">
									<div className="flex flex-row items-center gap-1">
										<Eye size={16} />
										<Trash size={16} />
										<div>{tracks.trackName}</div>
									</div>
								</div>
								{/* Individual Track in each tracks */}
								<div
									className="relative h-full"
									style={{ width: zoom * totalWidth }}>
									{tracks.tracks.map((tr, i) => {
										return (
											<XDraggable
												key={i}
												initialX={tr.start}
												xLimit={[0, totalWidth]}
												width={tr.end - tr.start}
												zoom={zoom}
												onXChange={(newX: number) =>
													props.movePanelTrackHandler(panelId, i, newX)
												}>
												<div
													onClick={() => console.log(tr.start, tr.end)}
													// absolute block h-full w-fit rounded border text-center
													className={`h-full rounded border text-center ${
														colors[i % colors.length]
													}`}
													style={{
														// left: zoom * tr.start * 100,
														// width: zoom * (tr.end - tr.start) * 100,
														width: "100%",
													}}>
													{zoom * (tr.end - tr.start) * 100 > 100 && (
														<div className="text-ellipsis text-nowrap w-full text-center">
															{tr.file.name}
														</div>
													)}
												</div>
											</XDraggable>
										);
									})}
									{/* <ContextMenu items={menuItems}>										
									</ContextMenu> */}
								</div>
							</div>
						);
					})}

					{/* SpeechBubble Tracks */}
					{props.speechBubbleDatas.map((tracks, sbId) => {
						return (
							<div
								className="relative h-7 flex flex-row flex-nowrap items-center hover:bg-slate-200"
								key={sbId}
								style={{
									width: totalWidth + 160,
								}}>
								<div className="border text-sm p-[0.2rem] w-40 min-w-40 sticky left-0 z-[1] bg-slate-300/10 backdrop-blur-lg">
									<div className="flex flex-row items-center gap-1">
										<Eye size={16} />
										<Trash size={16} />
										<div>{tracks.trackName}</div>
									</div>
								</div>
								{/* Individual Track in each tracks */}
								<div
									className="relative h-full"
									style={{ width: zoom * totalWidth }}>
									{tracks.tracks.map((tr, i) => {
										return (
											<XDraggable
												key={i}
												initialX={tr.start}
												xLimit={[0, totalWidth]}
												width={tr.end - tr.start}
												zoom={zoom}
												onXChange={(newX: number) =>
													props.movePanelTrackHandler(sbId, i, newX)
												}>
												<div
													onClick={() => console.log(tr.start, tr.end)}
													// absolute block h-full w-fit rounded border text-center
													className={`h-full rounded border text-center ${
														colors[i % colors.length]
													}`}
													style={{
														// left: zoom * tr.start * 100,
														// width: zoom * (tr.end - tr.start) * 100,
														width: "100%",
													}}>
													{zoom * (tr.end - tr.start) * 100 > 100 && (
														<div className="text-ellipsis text-nowrap w-full text-center">
															{tr.file.name}
														</div>
													)}
												</div>
											</XDraggable>
										);
									})}
									{/* <ContextMenu items={menuItems}>										
									</ContextMenu> */}
								</div>
							</div>
						);
					})}
					{/* Audio Tracks */}
					{props.audioDatas.map((tracks, audioId) => {
						return (
							<div
								className="relative h-7 flex flex-row flex-nowrap items-center hover:bg-slate-200"
								key={audioId}
								style={{
									width: totalWidth + 160,
								}}>
								<div className="border text-sm p-[0.2rem] w-40 min-w-40 sticky left-0 z-[1] bg-slate-300/10 backdrop-blur-lg">
									<div className="flex flex-row items-center gap-1">
										<Eye size={16} />
										<Trash size={16} />
										<div>{tracks.trackName}</div>
									</div>
								</div>
								{/* Individual Track in each tracks */}
								<div
									className="relative h-full"
									style={{ width: zoom * totalWidth }}>
									{tracks.tracks.map((tr, i) => {
										return (
											<XDraggable
												key={i}
												initialX={tr.start}
												xLimit={[0, totalWidth]}
												width={tr.end - tr.start}
												zoom={zoom}
												onXChange={(newX: number) =>
													props.moveAudioTrackHandler(audioId, i, newX)
												}>
												<div
													onClick={() => console.log(tr.start, tr.end)}
													// absolute block h-full w-fit rounded border text-center
													className={`h-full rounded border text-center ${
														colors[i % colors.length]
													}`}
													style={{
														// left: zoom * tr.start * 100,
														// width: zoom * (tr.end - tr.start) * 100,
														width: "100%",
													}}>
													{zoom * (tr.end - tr.start) * 100 > 100 && (
														<div
															className="text-ellipsis text-nowrap w-full text-center"
															title={tr.file.name}>
															{tr.file.name.slice(0, 10)}
														</div>
													)}
												</div>
											</XDraggable>
										);
									})}
									{/* <ContextMenu items={menuItems}>										
									</ContextMenu> */}
								</div>
							</div>
						);
					})}
					{/* /////////// */}
					{/* Track Lists2 */}
					{/* {Array.from({ length: 15 }, (_, i) => `Track${i}`).map((track, i) => {
						const start = 2 + Math.floor(Math.random() * (duration / 2));
						const stop = start + Math.floor(Math.random() * (duration / 2));
						// const start = 10;
						// const stop = 50;
						const len = stop - start;
						const menuItems: MenuItemI[] = [
							{
								label: (
									<>
										<Edit /> Edit
									</>
								),
								clickHandler: () =>
									console.log("Edit clicked", i, colors[i % colors.length]),
							},
							{
								label: (
									<>
										<Edit /> Delete
									</>
								),
								clickHandler: () =>
									console.log("Delete clicked", i, colors[i % colors.length]),
							},
							{
								label: (
									<>
										<Edit /> Top
									</>
								),
								clickHandler: () =>
									console.log("Top clicked", i, colors[i % colors.length]),
							},
						];
						return (
							<div
								className="relative h-7 flex flex-row flex-nowrap items-center hover:bg-slate-200"
								key={i}
								style={{
									// width: totalWidth + 160,
									width: totalWidth + 160,
								}}>
								<div className="border text-sm p-[0.2rem] w-40 min-w-40 sticky left-0 z-[1] bg-slate-300/10 backdrop-blur-lg">
									<div className="flex flex-row items-center gap-1">
										<Eye size={16} />
										<Trash size={16} />
										<div>{track}</div>
									</div>
								</div>
								<div className="relative h-full w-fit">
									<ContextMenu items={menuItems}>
										<div
											className={`relative h-full w-fit rounded border text-center ${
												colors[i % colors.length]
											}`}
											style={{
												left: zoom * start * 100,
												width: zoom * len * 100,
											}}>
											{zoom * len * 100 > 100 && (
												<>
													{formatTime(start)} : {formatTime(stop)}
												</>
											)}
										</div>
									</ContextMenu>
								</div>
							</div>
						);
					})} */}
				</div>
			</div>
		</div>
	);
};

export default Timeline;
