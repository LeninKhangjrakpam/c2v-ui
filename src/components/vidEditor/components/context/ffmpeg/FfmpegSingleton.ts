import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";

export default class FfmpegSingleton {
	public static ffmpegInstance: FfmpegSingleton | null = null;
	private ffmpeg: FFmpeg | null = null;
	private mssgLogger: (mssg: string) => void;
	private stateSetter: (state: boolean) => void;

	private constructor(
		mssgLogger: (mssg: string) => void,
		stateSetter: (state: boolean) => void,
	) {
		this.mssgLogger = mssgLogger;
		this.stateSetter = stateSetter;
	}

	private async init() {
		if (FfmpegSingleton.ffmpegInstance && FfmpegSingleton.ffmpegInstance.ffmpeg)
			return;
		this.stateSetter(true);
		try {
			this.ffmpeg = new FFmpeg();
			const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
			if (!this.ffmpeg) {
				console.log("init ffmpeg err");
				throw new Error("Ffmpeg cannot be initialised");
			}
			this.ffmpeg.on("log", ({ message }) => {
				this.mssgLogger(message);
				console.log(message);
			});

			// toBlobURL is used to bypass CORS issue, urls with the same
			// domain can be used directly.
			await this.ffmpeg.load({
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
		} finally {
			this.stateSetter(false);
		}
	}

	// TODO
	public async destroyInstance() {
		if (!this.ffmpeg) {
			throw new Error("ffmpeg cannot be destroy as its not initialised");
		} else {
			this.ffmpeg.unmount("/");
		}
	}

	public static async getInstance(
		mssgLogger: (mssg: string) => void,
		stateSetter: (state: boolean) => void,
	) {
		if (!FfmpegSingleton.ffmpegInstance) {
			FfmpegSingleton.ffmpegInstance = new FfmpegSingleton(
				mssgLogger,
				stateSetter,
			);
			await FfmpegSingleton.ffmpegInstance.init();
			console.log("get instance1", FfmpegSingleton.ffmpegInstance);
		}
		return FfmpegSingleton.ffmpegInstance;
	}

	public getFfmpeg() {
		return this.ffmpeg!;
	}
}
