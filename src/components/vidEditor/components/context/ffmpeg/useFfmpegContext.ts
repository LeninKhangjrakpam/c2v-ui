import { useContext } from "react";
import FfmpegContext from "./FfmpegContext";

const useFfmpeg = () => {
	const ffmpegContxt = useContext(FfmpegContext);
	if (!ffmpegContxt) {
		throw new Error("Should be used under ffmpegContext provider component");
	}
	return ffmpegContxt;
};

export default useFfmpeg;
