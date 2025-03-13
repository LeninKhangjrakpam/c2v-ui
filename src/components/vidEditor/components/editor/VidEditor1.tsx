import { useEffect, useRef, useState } from "react";
import "../../index.css";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
	Settings,
	Download,
	Plus,
	ChevronDown,
	ChevronRight,
	MessageCircle,
	SquareMenu,
	FileAudio,
	Captions,
	Pause,
	Play,
	Folder,
	FolderOpen,
	RefreshCcw,
	LoaderIcon,
	Fullscreen,
	Volume2Icon,
	VolumeOff,
	X,
} from "lucide-react";
import Timeline from "./Timeline";

// Mock Datas
import {
	totalTrackTime,
	PanelDatas,
	SpeechBubbleDatas,
	AudioDatas,
	CaptionDatas,
} from "./mockData";
import {
	AudioTrackI,
	CaptionTrackI,
	PanelTrackI,
	SpeechBubbleTrackI,
	VidSettingType,
} from "./type";
import { VidStartupModal } from "../../App";
import useFfmpeg from "../context/ffmpeg/useFfmpegContext";
import { fetchFile } from "@ffmpeg/util";
import { cmm1, cmm2, cmm3 } from "../../utils/command";
import { formatTime } from "../../utils/formatter";
import { initSettingConfig } from "../../utils/constants";
import SettingModal from "./SettingModal";
import { vidGenCmm1 } from "../../utils/vidGenCmm";
// import vidGenCmm from "../../utils/vidGenCmm";

const VidEditor1 = ({
	panelTrack,
	speechBubbleTrack,
	audioTrack,
}: {
	panelTrack: PanelTrackI;
	speechBubbleTrack: SpeechBubbleTrackI;
	audioTrack: AudioTrackI;
}) => {
	const [previewTimeStamp, setPreviewTimeStamp] = useState(0);
	const [isPlaying, setIsPlaying] = useState(false);

	// const [panelDatas, setPanelDatas] = useState<PanelTrackI[]>(PanelDatas);
	// const [speechBubbleDatas, setSpeechBubbleDatas] =
	// 	useState<SpeechBubbleTrackI[]>(SpeechBubbleDatas);
	// const [audioDatas, setAudioDatas] = useState<AudioTrackI[]>(AudioDatas);

	const [panelDatas, setPanelDatas] = useState<PanelTrackI[]>([panelTrack]);
	const [speechBubbleDatas, setSpeechBubbleDatas] = useState<
		SpeechBubbleTrackI[]
	>([speechBubbleTrack]);
	const [audioDatas, setAudioDatas] = useState<AudioTrackI[]>([audioTrack]);

	const [caption, setCaption] = useState<CaptionTrackI>(CaptionDatas);

	const [isFsLoadingComplete, setIsFsLoadingComplete] = useState(true); // assets loading

	const { ffmpeg, mssgLog, loadState: loading } = useFfmpeg();

	const [isVidGenerating, setIsVidGenerating] = useState(false);
	const [vidGenerated, setVidGenerated] = useState(false);

	const vidRef = useRef<HTMLVideoElement>(null);
	const [vidDuration, setVidDuration] = useState(
		panelTrack.tracks[panelTrack.tracks.length - 1].end,
	);

	const [vidCurrTime, setVidCurrTime] = useState(0);
	const [vidMute, setVidMute] = useState<boolean>(true);

	const [settingModalViz, setSettingModalViz] = useState<boolean>(false);
	const [vidSettingConfig, setVidSettingConfig] = useState<VidSettingType>({
		...initSettingConfig,
		duration: panelTrack.tracks[panelTrack.tracks.length - 1].end,
	});

	useEffect(() => {
		if (!vidRef.current) return;
		const vidElm = vidRef.current;
		vidElm.addEventListener("timeupdate", () => {
			setVidCurrTime(vidElm.currentTime);
			setPreviewTimeStamp(vidElm.currentTime);
			if (vidElm.currentTime >= vidElm.duration) {
				// Pause when vid ends
				setIsPlaying(false);
			}
		});

		vidElm.addEventListener("play", () => setIsPlaying(true));
		vidElm.addEventListener("pause", () => setIsPlaying(false));
		vidElm.addEventListener("ended", () => setIsPlaying(false));

		vidElm.addEventListener("loadedmetadata", () => {
			setVidDuration(vidElm.duration);
		});
		vidElm.addEventListener("volumechange", () => {
			setVidMute(vidElm.muted);
		});

		return () => {
			vidElm.removeEventListener("timeupdate", () => {});
			vidElm.removeEventListener("loadedmetadata", () => {});
			vidElm.addEventListener("volumechange", () => {});
		};
	}, []);

	useEffect(() => {
		if (loading) return;
		const f = ffmpeg?.getFfmpeg();
		if (f) {
			console.log("S: ", f);

			const op = async () => {
				setIsFsLoadingComplete(false);

				// setLoadingFs(true);
				// Add some folder to ffmpeg
				await f.createDir("./panels");
				// List the added folder
				let fs = await f.listDir(".");
				console.log(fs);

				// Add some images to ffmpeg
				await f.writeFile("1.png", await fetchFile("./1.png"));
				await f.writeFile("2.png", await fetchFile("./2.png"));
				await f.writeFile("3.png", await fetchFile("./3.png"));
				await f.writeFile("4.png", await fetchFile("./4.png"));
				await f.writeFile("5.png", await fetchFile("./5.png"));
				// Add audio files to ffmpeg
				await f.writeFile("1.wav", await fetchFile("./1.wav"));
				await f.writeFile("2.wav", await fetchFile("./2.wav"));
				await f.writeFile("3.wav", await fetchFile("./3.wav"));
				await f.writeFile("4.wav", await fetchFile("./4.wav"));

				// Write assets files to ffmpeg

				panelTrack.tracks.forEach(async (p) => {
					await f.writeFile(p.file.name, await fetchFile(p.file.url));
				});
				speechBubbleTrack.tracks.forEach(
					async (sb) =>
						await f.writeFile(sb.file.name, await fetchFile(sb.file.url)),
				);
				audioTrack.tracks.forEach(
					async (sd) =>
						await f.writeFile(sd.file.name, await fetchFile(sd.file.url)),
				);

				setIsFsLoadingComplete(true);
				// List the added images
				fs = await f.listDir(".");
				console.log(fs);
				// setVirtualFs(fs.map((d) => d.name));
				// setLoadingFs(false);
			};
			op();
		}
	}, [ffmpeg, loading]);
	// useEffect(() => {
	// 	if (loading === false && ffmpeg && ffmpeg.getFfmpeg() !== null) {
	// 		const _ffmpeg = ffmpeg.getFfmpeg();

	// 		const importAssets = async () => {
	// 			setIsFsLoadingComplete(false);
	// 			// Make directory
	// 			await _ffmpeg.createDir("panels");

	// 			panelDatas.forEach((pTrack) => {
	// 				pTrack.tracks.forEach(async (d) => {
	// 					console.log(d.file.url, d.file.name);
	// 					//Write each of imgs
	// 					await _ffmpeg.writeFile(
	// 						`${d.file.name}`,
	// 						await fetchFile(`${d.file.url}`),
	// 					);
	// 				});
	// 			});

	// 			await _ffmpeg.writeFile(
	// 				"input.webm",
	// 				await fetchFile(
	// 					"https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm",
	// 				),
	// 			);
	// 			console.log("dddd: ", await _ffmpeg.listDir("/"));
	// 			setIsFsLoadingComplete(true);
	// 			console.log("dir: ", await _ffmpeg.listDir("."));
	// 		};
	// 		importAssets();
	// 		// (async () => {
	// 		// 	await importAssets();
	// 		// 	console.log("dir2: ", await _ffmpeg.listDir("."));
	// 		// })();
	// 	}
	// }, [ffmpeg, loading]);

	const movePanelTrack = (
		panelId: number,
		trackId: number,
		newStartX: number,
	) => {
		let collide = false;
		setPanelDatas((d) => {
			const len =
				d[panelId].tracks[trackId].end - d[panelId].tracks[trackId].start;
			// Check for track collision
			collide = d[panelId].tracks.some(
				(d, i) =>
					(i !== trackId && newStartX > d.start && newStartX < d.end) ||
					(i !== trackId &&
						newStartX + len > d.start &&
						newStartX + len < d.end),
			);

			if (collide) return d;
			d[panelId].tracks[trackId].start = newStartX;
			d[panelId].tracks[trackId].end = newStartX + len;
			return [...d];
		});
		setVidGenerated(false);
		return collide;
	};

	const moveAudioTrack = (
		audioId: number,
		trackId: number,
		newStartX: number,
	) => {
		let collide = false;
		setAudioDatas((d) => {
			const len =
				d[audioId].tracks[trackId].end - d[audioId].tracks[trackId].start;
			// Check for track collision
			collide = d[audioId].tracks.some(
				(d, i) =>
					(i !== trackId && newStartX > d.start && newStartX < d.end) ||
					(i !== trackId &&
						newStartX + len > d.start &&
						newStartX + len < d.end),
			);

			if (collide) return d;
			d[audioId].tracks[trackId].start = newStartX;
			d[audioId].tracks[trackId].end = newStartX + len;
			return [...d];
		});
		setVidGenerated(false);
		return collide;
	};

	const genVideo = () => {
		if (loading) return;
		const f = ffmpeg?.getFfmpeg();
		if (f) {
			const gen = async () => {
				setVidGenerated(false);
				setIsVidGenerating(true);
				// const num = await f.exec(cmm2);
				const cmnd = vidGenCmm1(
					vidSettingConfig,
					panelDatas,
					speechBubbleDatas,
					audioDatas,
					caption,
				);
				console.log("cmnd: ", cmnd);
				// console.log("cmm2", cmm2);
				const num = await f.exec(cmnd);
				// const num = await f.exec(cmm3);
				console.log(num, "generated");
				let fs = await f.listDir(".");
				setVidGenerated(true);
				setIsVidGenerating(false);
				console.log(fs);
				// Read Video for displaying to screen
				const data = await f.readFile("output.mp4");
				if (vidRef.current) {
					vidRef.current.src = URL.createObjectURL(
						new Blob([data as Uint8Array], { type: "video/mp4" }),
					);
				}
			};
			gen();
		}
	};

	const gen1 = () => {
		if (vidRef.current) {
			vidRef.current.src = "./BigBuckBunny.mp4";
			console.log("src: ", vidRef.current.src);
		}
		setIsVidGenerating(false);
		setVidGenerated(true);
		console.log("vid generated");
	};

	return (
		<div className="relative text-slate-700 bg-slate-100 w-full h-screen max-h-screen rounded-lg border-2 border-slate-400 m-0 p-0">
			<VidStartupModal isFsLoaded={isFsLoadingComplete} />
			{/* Top Bar */}
			<div className="flex justify-between items-center py-2 px-4 bg-slate-700 rounded-lg">
				<h1 className=" text-slate-50 text-lg font-bold ">
					Comic Video Editor
				</h1>
				<div className="space-x-4 flex flex-row justify-center items-center text-sm text-white">
					<button
						className="px-4 py-2 bg-blue-600 rounded-lg flex items-center gap-2"
						onClick={() => setSettingModalViz(true)}>
						<Settings size={16} />
						Settings
					</button>
					<Menu
						as="div"
						className="relative inline-block m-auto max-w-full w-full">
						<div>
							<MenuButton className="my-0 max-w-full bg-green-600 text-slate-50 rounded-lg flex flex-row space-x-1 flex-nowrap items-center justify-center px-4 py-2">
								<Download size={16} />
								<div className="">Export</div>
								<ChevronDown size={18} />
							</MenuButton>
						</div>
						<MenuItems
							transition
							className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
							<div className="py-1">
								<MenuItem>
									<div
										className="flex flex-row flex-nowrap items-center gap-1 px-2 py-1 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none hover:cursor-pointer"
										onClick={() => {
											console.log(
												"Export : ",
												// vidGenCmm1(
												// 	vidSettingConfig,
												// 	panelDatas,
												// 	speechBubbleDatas,
												// 	audioDatas,
												// 	caption,
												// ),
											);
											if (vidRef.current) {
												console.log(vidRef.current.src);
											}
										}}>
										{vidRef.current && vidRef.current.src.length !== 0 ? (
											<a
												href={vidRef.current.src}
												download="movie.mp4"
												className="inline-flex gap-1">
												<Download size={16} /> Export as MP4
											</a>
										) : (
											<span className="hover:cursor-not-allowed">
												<Download size={16} /> Export as MP4
											</span>
										)}
									</div>
								</MenuItem>
								<MenuItem>
									<div
										className="flex flex-row flex-nowrap items-center gap-1 px-2 py-1 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none hover:cursor-pointer"
										onClick={() => console.log("Export as AVI")}>
										<Download size={16} /> Export as AVI
									</div>
								</MenuItem>
								<MenuItem>
									<div
										className="flex flex-row flex-nowrap items-center gap-1 px-2 py-1 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none hover:cursor-pointer"
										onClick={() => console.log("Export as MKV")}>
										<Download size={16} /> Export as MKV
									</div>
								</MenuItem>
							</div>
						</MenuItems>
					</Menu>
				</div>
			</div>
			{/* Setting Modal */}
			<SettingModal
				viz={settingModalViz}
				setViz={setSettingModalViz}
				config={vidSettingConfig}
				setConfig={setVidSettingConfig}
			/>
			{/* Main contents */}
			<div className="flex flex-auto flex-nowrap w-full overflow-auto">
				{/* Left Sidebar - Assets */}
				<div className="w-1/5 bg-slate-200 text-slate-800 p-4 px-2 rounded-lg">
					<h2 className="font-bold mb-4">Assets</h2>
					<Menu
						as="div"
						className="relative inline-block m-auto max-w-full w-full">
						<div>
							<MenuButton className="my-0 max-w-full bg-blue-600 text-slate-50 rounded-lg flex flex-row flex-nowrap items-center justify-center">
								<div className="my-0 pl-2 pr-1 py-2 flex flex-row flex-nowrap items-center gap-1 borer-r-[#3e92ff]">
									<Plus size={16} />
									Add Assets
								</div>
								<div className="my-0 pr-2 pl-0 py-2 border-l-2 border-l-[#3e92ff]">
									<ChevronDown size={18} />
								</div>
							</MenuButton>
						</div>
						<MenuItems
							transition
							className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in">
							<div className="py-1">
								<MenuItem>
									<div className="flex flex-row flex-nowrap items-center gap-1 px-2 py-1 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none hover:cursor-pointer">
										<SquareMenu size={16} />
										Add Panels
									</div>
								</MenuItem>
								<MenuItem>
									<div className="flex flex-row flex-nowrap items-center gap-1 px-2 py-1 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none hover:cursor-pointer">
										<MessageCircle size={16} />
										Add Speech Bubbles
									</div>
								</MenuItem>
								<MenuItem>
									<div className="flex flex-row flex-nowrap items-center gap-1 px-2 py-1 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none hover:cursor-pointer">
										<FileAudio size={16} />
										Add Audios
									</div>
								</MenuItem>
								<MenuItem>
									<div className="flex flex-row flex-nowrap items-center gap-1 px-2 py-1 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none hover:cursor-pointer">
										<Captions size={16} />
										Add Captions
									</div>
								</MenuItem>
							</div>
						</MenuItems>
					</Menu>

					{/* Files */}
					<div className="mt-4 h-[40dvh]">
						<Assets />
					</div>
				</div>

				{/* Preview */}
				<div className="flex-auto p-4 items-center">
					{/* <div className="h-[45vh] w-full border  my-1 rounded-lg"> */}
					<div className="h-[45dvh] w-full border  my-1 rounded-lg flex items-center bg-gray-200 shadow-sm">
						<>
							<button
								// onClick={gen1}
								onClick={genVideo}
								className={`relative w-full h-full text-gray-400 bg-black rounded-lg flex items-center justify-center mb-4 border border-red-400 ${
									vidGenerated && "hidden"
								}`}>
								{isVidGenerating ? (
									<>
										<LoaderIcon
											size={16}
											className="animate-spin"
											stroke="orange"
										/>{" "}
										Generating
									</>
								) : (
									<>Generate </>
								)}{" "}
								Preview
							</button>

							<div
								className={`relative w-full h-[40vh] overflow-hidden rounded-lg ${
									!vidGenerated && "hidden"
								}`}>
								<video
									ref={vidRef}
									controls={false}
									muted={true}
									className="max-w-full max-h-[40vh] h-auto w-full rounded-lg"></video>
							</div>
						</>
					</div>

					{/* Video Player Controls */}
					<div className="flex items-center gap-1 border border-green-600 rounded-lg p-2 w-full">
						<button
							disabled={!vidGenerated}
							className="p-2 bg-blue-600 rounded-full"
							onClick={() => {
								if (vidRef.current) {
									if (isPlaying) vidRef.current.pause();
									else vidRef.current.play();
								}
								setIsPlaying(!isPlaying);
							}}>
							{isPlaying ? <Pause size={20} /> : <Play size={20} />}
						</button>

						<div className="flex flex-row items-center gap-1 relative w-full border-rose-400">
							<div className="text-nowrap text-sm">
								{!vidGenerated ? (
									<>--:--:-- / --:--:--</>
								) : (
									<>
										{formatTime(vidCurrTime, false)} /{" "}
										{formatTime(vidDuration, false)}
									</>
								)}
							</div>
							<div className="relative w-full">
								<input
									type="range"
									min={0}
									max={vidDuration || 0}
									value={vidCurrTime}
									disabled={!(vidGenerated && !isVidGenerating)}
									onChange={(e) => {
										if (vidRef.current) {
											vidRef.current.currentTime = +e.target.value;
											setVidCurrTime(+e.target.value);
										}
									}}
									className="w-full"
								/>
							</div>
							<button
								className="rounded border p-1 hover:bg-gray-200 transition-all"
								disabled={!(vidGenerated && !isVidGenerating)}
								onClick={() => {
									vidRef.current?.requestFullscreen();
								}}>
								<Fullscreen size={20} />
							</button>
							<button
								className="rounded border p-1 hover:bg-gray-200 transition-all"
								disabled={!(vidGenerated && !isVidGenerating && vidRef.current)}
								onClick={() => {
									if (vidRef.current) {
										vidRef.current.muted = !vidRef.current.muted;
										setVidMute(vidRef.current.muted);
									}
								}}>
								{vidMute ? <VolumeOff size={20} /> : <Volume2Icon size={20} />}
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* Timeline */}
			<div className="w-full h-fit border rounded ">
				<Timeline
					panelDatas={panelDatas}
					speechBubbleDatas={speechBubbleDatas}
					audioDatas={audioDatas}
					movePanelTrackHandler={movePanelTrack}
					moveAudioTrackHandler={moveAudioTrack}
					caption={caption}
					// duration={totalTrackTime}
					duration={vidDuration}
					previewMarkerTimeStamp={previewTimeStamp}
					setPreviewMarkerTimeStamp={(seconds: number) => {
						if (vidRef.current) {
							if (seconds < 0 || seconds > vidRef.current.duration) return;
							setPreviewTimeStamp(seconds);
							vidRef.current.currentTime = seconds;
						}
					}}
				/>
			</div>
		</div>
	);
};

const AssetFileDropDown = ({
	header,
	children,
}: {
	header: JSX.Element;
	children: JSX.Element[];
}) => {
	const [dropdownViz, setDropdownViz] = useState<boolean>(false);
	return (
		<>
			<div
				className="flex flex-row flex-nowrap items-center text-md gap-1 w-full hover:bg-slate-200 hover:cursor-pointer overflow-auto"
				onClick={() => setDropdownViz((d) => !d)}>
				{dropdownViz ? (
					<>
						<ChevronDown size={16} />
						<FolderOpen size={16} />
					</>
				) : (
					<>
						<ChevronRight size={16} />
						<Folder size={16} />
					</>
				)}
				<div className="font-bold">{header}</div>
			</div>
			{dropdownViz && (
				<>
					{children.map((d, i) => (
						<div
							className="pl-8 w-full hover:bg-slate-200 hover:cursor-pointer"
							key={i}>
							{d}
						</div>
					))}
				</>
			)}
		</>
	);
};
const Assets = () => {
	// { items, setPreview }
	const { ffmpeg, mssgLog, loadState } = useFfmpeg();
	const [panelFiles, setPanelFiles] = useState<string[]>([]);

	useEffect(() => {
		if (loadState === false && ffmpeg && ffmpeg.getFfmpeg() !== null) {
			ffmpeg
				.getFfmpeg()
				.listDir(".")
				.then((d) => {
					console.log(d);
					setPanelFiles(d.map((di) => di.name));
				});
		}
	}, [ffmpeg, loadState]);

	const refreshFS = () => {
		if (loadState === false && ffmpeg && ffmpeg.getFfmpeg() !== null) {
			ffmpeg
				.getFfmpeg()
				.listDir(".")
				.then((d) => {
					console.log(d);
					setPanelFiles(d.map((di) => di.name));
				});
		}
	};
	return (
		<div className="border border-slate-300 bg-slate-300 rounded-md max-w-full max-h-full w-full h-full overflow-auto">
			<button onClick={refreshFS}>
				<RefreshCcw size={16} />
			</button>
			<AssetFileDropDown header={<div>Panels ({12})</div>}>
				{panelFiles.map((d, i) => (
					<div key={i} className="flex flex-row flex-nowrap items-center gap-1">
						<SquareMenu size={14} />
						{d}
					</div>
				))}
			</AssetFileDropDown>
			<AssetFileDropDown
				header={<div>Panels ({12})</div>}
				children={Array.from({ length: 3 }, (_, i) => (
					<div key={i} className="flex flex-row flex-nowrap items-center gap-1">
						<SquareMenu size={14} />
						{`${i}.jpeg`}
					</div>
				))}
			/>
			<AssetFileDropDown
				header={<div>Panels ({12})</div>}
				children={Array.from({ length: 3 }, (_, i) => (
					<div key={i} className="flex flex-row flex-nowrap items-center gap-1">
						<SquareMenu size={14} />
						{`${i}.jpeg`}
					</div>
				))}
			/>
			<AssetFileDropDown
				header={<div>Speech Bubbles</div>}
				children={Array.from({ length: 3 }, (_, i) => (
					<div key={i} className="flex flex-row flex-nowrap items-center gap-1">
						<MessageCircle size={14} />
						<div> {`${i}.jpeg`}</div>
					</div>
				))}
			/>
			<AssetFileDropDown
				header={<div>Audios</div>}
				children={Array.from({ length: 3 }, (_, i) => (
					<div key={i} className="flex flex-row flex-nowrap items-center gap-1">
						<FileAudio size={14} />
						<div>{`${i}.mp3`}</div>
					</div>
				))}
			/>
			<AssetFileDropDown
				header={<div>Captions</div>}
				children={Array.from({ length: 30 }, (_, i) => (
					<div
						key={i}
						className="flex flex-row flex-nowrap items-center gap-1 text-nowrap">
						<div>
							<Captions size={14} />
						</div>
						<div>{`${i}.txt`}</div>
					</div>
				))}
			/>
		</div>
	);
};

export default VidEditor1;
