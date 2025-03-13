import { fetchFile } from "@ffmpeg/util";
import { useRef } from "react";
import FfmpegProvider from "./FfmpegProvider";

import useFfmpeg from "./useFfmpegContext";

export default function Exp() {
	return (
		<FfmpegProvider>
			<div className="text-black">
				This is parent component
				<C1 />
			</div>
		</FfmpegProvider>
	);
}

const C1 = () => {
	const { ffmpeg, mssgLog, loadState: loading } = useFfmpeg();
	if (ffmpeg) console.log("s: ", ffmpeg.getFfmpeg());
	const videoRef = useRef<HTMLVideoElement>(null);
	const messageRef = useRef<HTMLParagraphElement>(null);

	const transcode = async () => {
		if (!ffmpeg) return;
		const _ffmpeg = ffmpeg.getFfmpeg();
		await _ffmpeg.writeFile(
			"input.webm",
			await fetchFile(
				"https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm",
			),
		);
		await _ffmpeg.exec(["-i", "input.webm", "output.mp4"]);
		console.log(await _ffmpeg.listDir("."));
		const data = await _ffmpeg.readFile("output.mp4");
		if (videoRef.current) {
			videoRef.current.src = URL.createObjectURL(
				new Blob([data as Uint8Array], { type: "video/mp4" }),
			);
		}
	};

	return (
		<>
			<>This is child</>
			<>
				Load: {loading ? "Ffmpeg Loading" : "Ffmpeg Not Loading"}, msg:
				{mssgLog}
			</>
			<>
				<video ref={videoRef} controls></video>
				<br />
				<button onClick={transcode}>Transcode webm to mp4</button>
				<p ref={messageRef}></p>
				<p>Open Developer Tools (Ctrl+Shift+I) to View Logs</p>
			</>
		</>
	);
};
