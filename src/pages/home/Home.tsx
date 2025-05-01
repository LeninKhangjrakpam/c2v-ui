import { useEffect, useState } from "react";

import { AssetGeneration, CharacterDataResponse } from "./AsssetGeneration";
import useFilesInput from "../../hooks/useFileInput";
import usePanelData from "../../hooks/usePanelData";
import { SpeechBubbleData, SpeechData } from "../../components/inputData.type";
import {
	PanelTrackI,
	SpeechBubbleTrackI,
	AudioTrackI,
} from "../../components/vidEditor/components/editor/type";
import {
	assetDataFormatter,
	initDataLoader,
} from "../../components/vidEditor/components/editor/mockData";

import ScrollToTopBtn from "../../components/scrollToTopBtn";
import VidEditorWrapper from "../../components/vidEditor/VidEditorWrapper";

import { getUUID } from "../../utils/util";

export type GenerationMode = "fullGen" | "characterGen";
export default function Home2() {
	const [generationMode, setGenerationMode] =
		useState<GenerationMode>("characterGen");

	const [inpFiles, setInpFiles, inpFilesHandlers] = useFilesInput();
	const [characterPanels, setCharacterPanels] =
		useState<null | CharacterDataResponse>(null);
	const [panels, setPanels, panelsHandler] = usePanelData();
	const [speechBubble, setSpeechBubble] = useState<SpeechBubbleData[]>([]);
	const [speechData, setSpeechData] = useState<SpeechData[]>([]);

	const [vidEdViz, setVidEdViz] = useState<boolean>(false);
	const [initData, setInitData] = useState<{
		panelTrack: PanelTrackI;
		speechBubbleTrack: SpeechBubbleTrackI;
		audioTrack: AudioTrackI;
	} | null>(null);

	/**
	 * Open vid editor
	 * Responsible for loading assets to ffmpeg system
	 */
	const openVidEditor = () => {
		const data = assetDataFormatter(panels, speechBubble, speechData);
		const trackData = initDataLoader(data);
		console.log(trackData);

		setInitData(trackData);
		setVidEdViz(true);
	};
	// Close Vid Editor
	// Responsible for unloading, clearnig assets from memory
	const closeVidEditor = () => {
		setVidEdViz(false);
	};

	const mockCharacter = async (): Promise<CharacterDataResponse> => {
		const b64ImgRes = await fetch("/Comic2Video/b64.txt");
		const b64Img = (await b64ImgRes.text()) satisfies string;
		const data: CharacterDataResponse = {
			data: Array.from({ length: 3 }, () => ({
				preview: b64Img,
				panels: Array.from({ length: 5 }, () => ({
					file_name: getUUID(),
					panel_data: b64Img,
				})),
			})),
		};
		return data;
	};

	useEffect(() => {
		(async () => {
			setCharacterPanels(await mockCharacter());
		})();
	}, []);

	return (
		<div className="relative">
			<h1 className="text-gray-600 font-roboto pt-1 pb-8 text-2xl font-extrabold">
				Comic to Video Generation
			</h1>

			{!vidEdViz ? (
				<AssetGeneration
					generationMode={generationMode}
					setGenerationMode={setGenerationMode}
					characterPanels={characterPanels}
					setCharacterPanels={setCharacterPanels}
					inpFiles={inpFiles}
					setInpFiles={setInpFiles}
					inpFilesHandlers={inpFilesHandlers}
					panels={panels}
					setPanels={setPanels}
					panelsHandler={panelsHandler}
					speechBubble={speechBubble}
					setSpeechBubble={setSpeechBubble}
					speechData={speechData}
					setSpeechData={setSpeechData}
					openVidEditor={openVidEditor}
					closeVidEditor={closeVidEditor}
				/>
			) : (
				<>{initData && <VidEditorWrapper initTrackDatas={initData} />}</>
			)}
			<ScrollToTopBtn />
		</div>
	);
}
