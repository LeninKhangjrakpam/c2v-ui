import { useState, useRef, useCallback, useEffect } from "react";
import FfmpegSingleton from "./FfmpegSingleton";
import FfmpegContext from "./FfmpegContext";

const FfmpegProvider = (props: { children: JSX.Element }) => {
	const [ffmpegLog, setFfmpegLog] = useState("");
	const [isFfmpegLoading, setIsFfmpegLoading] = useState(false);
	// const ffmpegRef = useRef<FfmpegSingleton | null>(null);
	const [ffmpeg, setFfmpeg] = useState<FfmpegSingleton | null>(null);

	const init = useCallback(async () => {
		setFfmpeg(
			await FfmpegSingleton.getInstance(
				(mssg) => setFfmpegLog(mssg),
				(loadState) => setIsFfmpegLoading(loadState),
			),
		);
		console.log("set ffmpeg", ffmpeg);
		// ffmpegRef.current = await FfmpegSingleton.getInstance(
		// 	(mssg) => setFfmpegLog(mssg),
		// 	(loadState) => setFfmpegLoadState(loadState),
		// );
	}, []);

	useEffect(() => {
		init();
	}, []);

	return (
		<FfmpegContext.Provider
			value={{
				ffmpeg: ffmpeg,
				loadState: isFfmpegLoading,
				mssgLog: ffmpegLog,
			}}>
			{props.children}
		</FfmpegContext.Provider>
	);
};

export default FfmpegProvider;
