import { Fullscreen, Pause, Play, Volume2Icon, VolumeOff } from "lucide-react";
import { formatTime } from "../../utils/formatter";

const VideoPreview = () => {
	return <>{/* <VidController /> */}</>;
};

type VidControllerProps = {
	vidGenerated: boolean;
	isVidGenerating: boolean;
	vidRef: React.RefObject<HTMLVideoElement>;
	isPlaying: boolean;
	vidCurrTime: number;
	vidDuration: number;
	vidMute: boolean;
	setVidMute: React.Dispatch<React.SetStateAction<boolean>>;
	setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
	setVidCurrTime: React.Dispatch<React.SetStateAction<number>>;
};
export const VidController = ({
	vidGenerated,
	isVidGenerating,
	vidRef,
	isPlaying,
	vidCurrTime,
	vidDuration,
	vidMute,
	setVidMute,
	setIsPlaying,
	setVidCurrTime,
}: VidControllerProps) => {
	return (
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
	);
};

export default VideoPreview;
