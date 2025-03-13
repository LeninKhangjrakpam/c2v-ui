import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";
import { useState, useRef } from "react";

export function Vid1() {
	const [loaded, setLoaded] = useState(false);
	const ffmpegRef = useRef(new FFmpeg());
	const videoRef = useRef<HTMLVideoElement>(null);
	const messageRef = useRef<HTMLParagraphElement>(null);

	const load = async () => {
		console.log("Click....");
		const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
		const ffmpeg = ffmpegRef.current;
		ffmpeg.on("log", ({ message }) => {
			if (messageRef && messageRef.current) {
				messageRef.current.innerHTML = message;
			}
			console.log(message);
		});
		// toBlobURL is used to bypass CORS issue, urls with the same
		// domain can be used directly.
		await ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
			wasmURL: await toBlobURL(
				`${baseURL}/ffmpeg-core.wasm`,
				"application/wasm",
			),
		});
		setLoaded(true);
	};
	// ffmpeg -framerate 1 -pattern_type glob -i 's1/*.png'  -c:v libx264 -r 30 -pix_fmt yuv420p -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2"  out.mp4
	// ffmpeg -framerate 1 -pattern_type glob -i 's1/*.png' -i 'aud/*.mp3' -c:v libx264 -r 30 -pix_fmt yuv420p -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2"  out.mp4
	/**
	 * [
  "-framerate", 
  "1",
  "-pattern_type", 
  "glob", 
  "-i", 
  "_*.png", 
  "-c:v", "libx264", "-r", "30",
  "-pix_fmt", "yuv420p",
  "-vf", 
  "pad=ceil(iw/2)*2:ceil(ih/2)*2",
  "out.mp4"
]
	 */
	const transcode = async () => {
		const ffmpeg = ffmpegRef.current;
		await ffmpeg.writeFile(
			"input.webm",
			await fetchFile(
				"https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm",
			),
		);
		await ffmpeg.exec(["-i", "input.webm", "output.mp4"]);
		console.log(await ffmpeg.listDir("."));
		const data = await ffmpeg.readFile("output.mp4");
		if (videoRef.current) {
			videoRef.current.src = URL.createObjectURL(
				new Blob([data as Uint8Array], { type: "video/mp4" }),
			);
		}
	};

	return loaded ? (
		<>
			<video ref={videoRef} controls></video>
			<br />
			<button onClick={transcode}>Transcode webm to mp4</button>
			<p ref={messageRef}></p>
			<p>Open Developer Tools (Ctrl+Shift+I) to View Logs</p>
		</>
	) : (
		<button
			className="border border-black p-1 rounded bg-green-200"
			onClick={load}>
			Load ffmpeg-core (~31 MB)
		</button>
	);
}

export default function Vid() {
	const [loaded, setLoaded] = useState(false);
	const ffmpegRef = useRef(new FFmpeg());
	const videoRef = useRef<HTMLVideoElement>(null);
	const messageRef = useRef<HTMLParagraphElement>(null);

	const load = async () => {
		console.log("Click....");
		const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
		const ffmpeg = ffmpegRef.current;
		ffmpeg.on("log", ({ message }) => {
			if (messageRef && messageRef.current) {
				messageRef.current.innerHTML = message;
			}
			console.log(message);
		});
		// toBlobURL is used to bypass CORS issue, urls with the same
		// domain can be used directly.
		await ffmpeg.load({
			coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
			wasmURL: await toBlobURL(
				`${baseURL}/ffmpeg-core.wasm`,
				"application/wasm",
			),
		});
		setLoaded(true);
	};
	// ffmpeg -framerate 1 -pattern_type glob -i 's1/*.png'  -c:v libx264 -r 30 -pix_fmt yuv420p -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2"  out.mp4
	// ffmpeg -framerate 1 -pattern_type glob -i 's1/*.png' -i 'aud/*.mp3' -c:v libx264 -r 30 -pix_fmt yuv420p -vf "pad=ceil(iw/2)*2:ceil(ih/2)*2"  out.mp4
	const transcode = async () => {
		const ffmpeg = ffmpegRef.current;
		await ffmpeg.writeFile(
			"input.webm",
			await fetchFile(
				"https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm",
			),
		);
		await ffmpeg.exec(["-i", "input.webm", "output.mp4"]);
		console.log(await ffmpeg.listDir("."));
		const data = await ffmpeg.readFile("output.mp4");
		if (videoRef.current) {
			videoRef.current.src = URL.createObjectURL(
				new Blob([data as Uint8Array], { type: "video/mp4" }),
			);
		}
	};

	return loaded ? (
		<>
			<video ref={videoRef} controls></video>
			<br />
			<button onClick={transcode}>Transcode webm to mp4</button>
			<p ref={messageRef}></p>
			<p>Open Developer Tools (Ctrl+Shift+I) to View Logs</p>
		</>
	) : (
		<button
			className="border border-black p-1 rounded bg-green-200"
			onClick={load}>
			Load ffmpeg-core (~31 MB)
		</button>
	);
}
