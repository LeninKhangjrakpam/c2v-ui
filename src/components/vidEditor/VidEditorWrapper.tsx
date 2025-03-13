import FfmpegProvider from "./components/context/ffmpeg/FfmpegProvider";
import {
	AudioTrackI,
	PanelTrackI,
	SpeechBubbleTrackI,
} from "./components/editor/type";
import VidEditor1 from "./components/editor/VidEditor1";

export default function VidEditorWrapper({
	initTrackDatas,
}: {
	initTrackDatas: {
		panelTrack: PanelTrackI;
		speechBubbleTrack: SpeechBubbleTrackI;
		audioTrack: AudioTrackI;
	};
}) {
	return (
		<>
			<div className="fixed w-full h-full left-0 right-0 top-0 bottom-0 z-[999]">
				<FfmpegProvider>
					<VidEditor1
						panelTrack={initTrackDatas.panelTrack}
						speechBubbleTrack={initTrackDatas.speechBubbleTrack}
						audioTrack={initTrackDatas.audioTrack}
					/>
				</FfmpegProvider>
			</div>
		</>
	);
}
