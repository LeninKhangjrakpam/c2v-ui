import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import {
	useState,
	useRef,
	useCallback,
	useEffect,
	createContext,
	useContext,
} from "react";

export class FfmpegSingltn {
	static ffmpegInstance: FfmpegSingltn | null;
	private ffmpeg: FFmpeg | null = null;
	private msgLogger: (msg: string) => void;
	private setLoadState: (state: boolean) => void;

	private constructor(
		msgLogger: (msg: string) => void,
		setLoadState: (state: boolean) => void,
	) {
		this.msgLogger = msgLogger;
		this.setLoadState = setLoadState;
	}

	private async init() {
		if (FfmpegSingltn.ffmpegInstance) return;
		this.setLoadState(false);
		try {
			this.ffmpeg = new FFmpeg();
			const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
			this.ffmpeg.on("log", ({ message }) => {
				this.msgLogger(message);
				console.log(message);
			});

			// toBlobURL is used to bypass CORS issue, urls with the same
			// domain can be used directly.
			await this.ffmpeg!.load({
				coreURL: await toBlobURL(
					`${baseURL}/ffmpeg-core.js`,
					"text/javascript",
				),
				wasmURL: await toBlobURL(
					`${baseURL}/ffmpeg-core.wasm`,
					"application/wasm",
				),
			});
		} catch (err) {
			console.error("Ffmpeg cannot be initialised", err);
			throw err;
		}
		this.setLoadState(true);
	}

	public static async getFfmpeg(
		mssgLogger: React.Dispatch<React.SetStateAction<string>>,
		setLoadState: React.Dispatch<React.SetStateAction<boolean>>,
	) {
		if (!FfmpegSingltn.ffmpegInstance) {
			FfmpegSingltn.ffmpegInstance = new FfmpegSingltn(
				mssgLogger,
				setLoadState,
			);
			await FfmpegSingltn.ffmpegInstance.init();
		}
		return FfmpegSingltn.ffmpegInstance;
	}
}

const FfmpegStateContext = createContext<{
	ffmpeg: FfmpegSingltn;
	loadState: boolean;
	mssgLog: string;
} | null>(null);

const FfmpegProvider = ({ children }: { children: JSX.Element }) => {
	const [ffmpegLog, setFfmpegLog] = useState("");
	const [ffmpegLoadState, setFfmpegLoadState] = useState(false);
	const ffmpegRef = useRef<FfmpegSingltn | null>(null);

	useEffect(() => {
		(async () => {
			ffmpegRef.current = await FfmpegSingltn.getFfmpeg(
				(mssg) => setFfmpegLog(mssg),
				(loadState) => setFfmpegLoadState(loadState),
			);
		})();
	}, []);

	return (
		<FfmpegStateContext.Provider
			value={{
				ffmpeg: ffmpegRef.current!,
				loadState: ffmpegLoadState,
				mssgLog: ffmpegLog,
			}}>
			{children}
		</FfmpegStateContext.Provider>
	);
};
const C1 = () => {
	const ffmpegContext = useContext(FfmpegStateContext);
	return (
		<>
			Load: {ffmpegContext?.loadState}, mssg: {ffmpegContext?.mssgLog}
		</>
	);
};

const Root = () => {
	return (
		<FfmpegProvider>
			<C1 />
		</FfmpegProvider>
	);
};
// const useFfmpeg = (msgLogger: React.Dispatch<React.SetStateAction<string>>) => {
// 	const [loaded, setLoaded] = useState(false);
// 	const ffmpegRef = useRef(new FFmpeg());

// 	const load = useCallback(async () => {
// 		console.log("Click....");
// 		const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
// 		const ffmpeg = ffmpegRef.current;
// 		ffmpeg.on("log", ({ message }) => {
// 			msgLogger(message);
// 			console.log(message);
// 		});
// 		// toBlobURL is used to bypass CORS issue, urls with the same
// 		// domain can be used directly.
// 		await ffmpeg.load({
// 			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
// 			wasmURL: await toBlobURL(
// 				`${baseURL}/ffmpeg-core.wasm`,
// 				"application/wasm",
// 			),
// 		});
// 		setLoaded(true);
// 	}, []);

// 	useEffect(() => {
// 		load();
// 	}, []);
// 	return [ffmpegRef, loaded];
// };

// export default useFfmpeg;

// export const FfmpegContext = createContext<{
// 	ffmpegLog: FFmpeg;
// 	loaded: boolean;
// } | null>(null);

// const Exp = () => {
// 	const [mssg, setMssg] = useState<string>("");
// 	const [ffmpeg, loaded] = useFfmpeg(setMssg);
// 	const FfmpwgContext = useContext(FfmpegContext);
// 	return <> This </>;
// };
