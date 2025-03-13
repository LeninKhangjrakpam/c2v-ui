import { createContext } from "react";
import FfmpegSingleton from "./FfmpegSingleton";

const FfmpegContext = createContext<{
	ffmpeg: FfmpegSingleton | null;
	mssgLog: string;
	loadState: boolean;
} | null>(null);

export default FfmpegContext;
