import { useState } from "react";
import { AudioTrackI, PanelTrackI, SpeechBubbleTrackI } from "./type";

type VidEditorProp = {
	panelTrack: PanelTrackI;
	speechBubbleTrack: SpeechBubbleTrackI;
	audioTrack: AudioTrackI;
};

const VidEditor = ({
	panelTrack,
	speechBubbleTrack,
	audioTrack,
}: VidEditorProp) => {
	const [panelDatas, setPanelDatas] = useState<PanelTrackI[]>([panelTrack]);
	const [speechBubbleDatas, setSpeechBubbleDatas] = useState<
		SpeechBubbleTrackI[]
	>([speechBubbleTrack]);
	const [audioDatas, setAudioDatas] = useState<AudioTrackI[]>([audioTrack]);

	return (
		<div className="relative text-slate-700 bg-slate-100 w-full h-screen max-h-screen rounded-lg border-2 border-slate-400 m-0 p-0">
			{/* Top Navbar */}

			{/* Setting Modal */}
			<SettingModal
				viz={settingModalViz}
				setViz={setSettingModalViz}
				config={vidSettingConfig}
				setConfig={setVidSettingConfig}
			/>
		</div>
	);
};

export default VidEditor;
