import { useState, useEffect, useContext, useRef, memo } from "react";
import "./App.css";
import "./index.css";
// import VideoEditor from "./components/editor/vidEditor";
import VidEditor1 from "./components/editor/VidEditor1";
import Vid from "./Vid";
import Exp from "./components/context/ffmpeg/Exp";
import { Check, LoaderPinwheel } from "lucide-react";
import useFfmpeg from "./components/context/ffmpeg/useFfmpegContext";
import FfmpegProvider from "./components/context/ffmpeg/FfmpegProvider";
import { fetchFile } from "@ffmpeg/util";

function App() {
	return (
		<FfmpegProvider>
			<div className="text-black">
				<div className="relative w-full max-w-8xl h-screen max-h-dvh my-0 mx-auto p-0">
					<VidEditor1 />

					{/* <Exp /> */}
					{/* <Test /> */}
				</div>
			</div>
		</FfmpegProvider>
	);
}

const Test = () => {
	const [virtualFs, setVirtualFs] = useState<string[]>([]);
	const [loadingVFs, setLoadingFs] = useState<boolean>(false);
	const [vidGenerated, setVidGenerated] = useState(false);
	const [mssg, setMssg] = useState("");

	const vidRef = useRef<HTMLVideoElement>(null);

	const { ffmpeg, mssgLog, loadState: loading } = useFfmpeg();

	useEffect(() => {
		setMssg((d) => d + mssgLog);
	}, [mssgLog]);

	useEffect(() => {
		if (loading) return;
		const f = ffmpeg?.getFfmpeg();
		if (f) {
			console.log("S: ", f);

			const op = async () => {
				setLoadingFs(true);
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
				// List the added images
				fs = await f.listDir(".");
				console.log(fs);
				setVirtualFs(fs.map((d) => d.name));
				setLoadingFs(false);
			};
			op();
		}
	}, [ffmpeg, loading]);

	const cmm1 = [
		"-y",
		"-f",
		"lavfi",
		"-t",
		"20",
		"-i",
		"color=c=black:s=426x240:r=30",
		"-loop",
		"1",
		"-t",
		"3",
		"-i",
		"1.png",
		"-loop",
		"1",
		"-t",
		"3",
		"-i",
		"2.png",
		"-filter_complex",
		"[1]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i1];[2]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i2];[0][i1]overlay=enable='between(t,0,3)'[v1];[v1][i2]overlay=enable='between(t,3,6)'[v]",
		"-map",
		"[v]",
		"-c:v",
		"libx264",
		"-pix_fmt",
		"yuv420p",
		"-r",
		"30",
		"-t",
		"20",
		"output.mp4",
	];

	const cmm2 = [
		"-y",
		"-f",
		"lavfi",
		"-t",
		"20",
		"-i",
		"color=c=black:s=426x240:r=30",
		"-loop",
		"1",
		"-t",
		"3",
		"-i",
		"1.png",
		"-loop",
		"1",
		"-t",
		"3",
		"-i",
		"2.png",
		"-loop",
		"1",
		"-t",
		"4",
		"-i",
		"3.png",
		"-loop",
		"1",
		"-t",
		"5",
		"-i",
		"4.png",
		"-loop",
		"1",
		"-t",
		"5",
		"-i",
		"5.png",
		"-filter_complex",
		"[1]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i1];" +
			"[2]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i2];" +
			"[3]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i3];" +
			"[4]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i4];" +
			"[5]scale=426:240:force_original_aspect_ratio=decrease,pad=426:240:(ow-iw)/2:(oh-ih)/2,setsar=1[i5];" +
			"[0][i1]overlay=enable='between(t,0,3)'[v1];" +
			"[v1][i2]overlay=enable='between(t,3,6)'[v2];" +
			"[v2][i3]overlay=enable='between(t,6,10)'[v3];" +
			"[v3][i4]overlay=enable='between(t,4,8)'[v4];" +
			"[v4][i5]overlay=enable='between(t,13,18)'[v]",
		"-map",
		"[v]",
		"-c:v",
		"libx264",
		"-pix_fmt",
		"yuv420p",
		"-r",
		"30",
		"-t",
		"20",
		"output1.mp4",
	];

	const genVideo = () => {
		if (loading) return;
		const f = ffmpeg?.getFfmpeg();
		if (f) {
			const gen = async () => {
				setVidGenerated(false);
				const num = await f.exec(cmm2);
				console.log(num, "generated");
				let fs = await f.listDir(".");
				setVidGenerated(true);
				console.log(fs);
				// Read Video for displaying to screen
				const data = await f.readFile("output1.mp4");
				if (vidRef.current) {
					vidRef.current.src = URL.createObjectURL(
						new Blob([data as Uint8Array], { type: "video/mp4" }),
					);
				}
			};

			gen();
		}
	};

	return (
		<div className="border rounded-lg p-2">
			<div>This is Test component</div>
			<div>Listing Files</div>
			<div>
				{loadingVFs ? (
					<>Loading FS...</>
				) : (
					<>
						{virtualFs.map((d, i) => (
							<div key={i}>{d}</div>
						))}
					</>
				)}
			</div>
			<button
				onClick={() => {
					genVideo();
				}}
				className="border bg-blue-400 text-white p-1 rounded">
				Display ffmpeg command
			</button>
			<div className="flex flex-row">
				{vidGenerated && (
					<div>
						<video ref={vidRef} controls></video>
					</div>
				)}
				<div className="max-h-40 border rounded-md w-3/6 overflow-auto">
					{mssg}
				</div>
			</div>
		</div>
	);
};

const useModal = (
	initViz: boolean = false,
): [
	boolean,
	React.Dispatch<React.SetStateAction<boolean>>,
	React.FC<{
		children: JSX.Element;
	}>,
] => {
	const [viz, setViz] = useState(initViz);

	const Modal: React.FC<{ children: JSX.Element }> = (props: {
		children: JSX.Element;
	}) => {
		return viz ? (
			<div className="fixed top-0 left-0 z-[999] bg-slate-50/50 backdrop-blur-sm w-screen max-w-[100vw] h-screen max-h-screen text-black">
				<div className="relative w-full h-full border border-yellow-800 flex justify-center items-center">
					<div className="border border-slate-500 shadow-md rounded-lg w-3/12 min-w-[18rem] p-2 bg-slate-50">
						{props.children}
					</div>
				</div>
			</div>
		) : (
			<></>
		);
	};

	return [viz, setViz, memo(Modal)];
};

export const VidStartupModal = (props: { isFsLoaded: boolean }) => {
	const [_, setViz, Modal] = useModal(true);
	const [editorLoaded, setEditorLoaded] = useState(false);

	const { ffmpeg, mssgLog, loadState: loading } = useFfmpeg();
	const [isFfmpegLoaded, setIsFfmpegLoaded] = useState(false);
	const [isAssetLoaded, setIsAssetLoaded] = useState(false);

	useEffect(() => {
		// callback function to call when event triggers
		const onPageLoad = () => {
			console.log("page loaded");
			setEditorLoaded(true);
		};

		// Check if the page has already loaded
		if (document.readyState === "complete") {
			onPageLoad();
		} else {
			window.addEventListener("load", onPageLoad, false);
			// Remove the event listener when component unmounts
			return () => window.removeEventListener("load", onPageLoad);
		}
	}, []);

	useEffect(() => {
		if (loading === false && ffmpeg && ffmpeg.getFfmpeg() !== null) {
			setIsFfmpegLoaded(true);
			console.log("load complete");
			(async () => {
				const f = ffmpeg.getFfmpeg();
				console.log("From vid component before", await f.listDir("/"));
				await f.createDir("/3333");
				console.log("From vid component after", await f.listDir("/"));
				// await f.writeFile(
				// 	"input.webm",
				// 	await fetchFile(
				// 		"https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm",
				// 	),
				// );
				// console.log("From vid component after", await f.listDir("/"));
				// const data = await f.readFile("input.webm");
				// console.log("DD: ", data);
			})();
		}
	}, [loading, ffmpeg]);

	useEffect(() => {
		if (
			loading === false &&
			ffmpeg &&
			ffmpeg.getFfmpeg() !== null &&
			props.isFsLoaded === false
		) {
			setIsAssetLoaded(true);
		}
	}, [loading, ffmpeg, props.isFsLoaded]);

	return (
		<Modal>
			<div className="w-full">
				<div className="relative w-full text-right pr-2">
					<div className="inline-block mx-1">Status</div>
					<div
						className={`inline-block w-3 h-3 rounded-full animate-pulse ${
							editorLoaded && isFfmpegLoaded && props.isFsLoaded
								? "bg-green-500"
								: "bg-orange-500"
						}`}></div>
				</div>
				<div className="border rounded-md border-slate-300 p-1">
					<div className="flex flex-row gap-1 items-center">
						{editorLoaded ? (
							<>
								<Check size={16} stroke="green" /> Complete Loading Video Editor
							</>
						) : (
							<>
								<LoaderPinwheel
									size={16}
									stroke="grey"
									className="animate-spin"
								/>
								Loading Video Editor
							</>
						)}
					</div>
					<div className="flex flex-row gap-1 items-center">
						{isFfmpegLoaded ? (
							<>
								<Check size={16} stroke="green" /> Complete Loading FFmpeg{" "}
							</>
						) : (
							<>
								<LoaderPinwheel
									size={16}
									stroke="grey"
									className="animate-spin"
								/>
								Loading FFmpeg
							</>
						)}
					</div>
					<div className="flex flex-row gap-1 items-center">
						{isAssetLoaded && props.isFsLoaded ? (
							<>
								<Check size={16} stroke="green" /> Complete Importing Media
								Assets to Ffmpeg
							</>
						) : (
							<>
								<LoaderPinwheel
									size={16}
									stroke="grey"
									className="animate-spin"
								/>
								Importing Media Assets to Ffmpeg
							</>
						)}
					</div>
					<div className="flex flex-row gap-1 items-center">
						{editorLoaded &&
						isFfmpegLoaded &&
						isAssetLoaded &&
						props.isFsLoaded ? (
							<Check size={16} stroke="green" />
						) : (
							<LoaderPinwheel
								size={16}
								stroke="grey"
								className="animate-spin"
							/>
						)}
						All Status
					</div>
				</div>
				<button
					disabled={!(editorLoaded && isFfmpegLoaded && props.isFsLoaded)}
					onClick={() => setViz(false)}
					className="bg-green-600 disabled:bg-green-800 text-white py-1 px-2 rounded-md mx-auto my-2 block">
					{editorLoaded && isFfmpegLoaded && isAssetLoaded ? "Open" : "Loading"}{" "}
					Video Editor
				</button>
			</div>
		</Modal>
	);
};

export default App;
export { useModal };
