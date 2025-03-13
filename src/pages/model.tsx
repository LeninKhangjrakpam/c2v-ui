import FfmpegProvider from "../components/vidEditor/components/context/ffmpeg/FfmpegProvider";
import VidEditor1 from "../components/vidEditor/components/editor/VidEditor1";

const Model = () => {
	// return (
	// 	<>
	// 		<h1 className="text-3xl font-bold tracking-tight text-gray-900">Model</h1>
	// 	</>
	// );

	return (
		<div className="fixed w-full h-full left-0 right-0 top-0 bottom-0 z-[999]">
			<FfmpegProvider>
				<VidEditor1 />
			</FfmpegProvider>
		</div>
	);
};

export default Model;
