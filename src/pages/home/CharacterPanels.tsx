import React, { useEffect, useState } from "react";
import { CharacterDataResponse } from "./AsssetGeneration";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { PanelDataHandler } from "../../hooks/usePanelData";
import { Check, Loader2 } from "lucide-react";
import { b64ToBlob, blobToFile, getUUID } from "../../utils/util";
import { PanelData } from "../../components/inputData.type";

interface CharacterPanelProp {
	characterPanels: CharacterDataResponse | null;
	setCharacterPanels: React.Dispatch<
		React.SetStateAction<CharacterDataResponse | null>
	>;
	setPanels: React.Dispatch<React.SetStateAction<PanelData[]>>;
	panelsHandler: PanelDataHandler;
	submitHandler: () => void;
	isSubmitLoading: boolean;
	regenerateHandler: () => void;
}

const CharacterPanel: React.FC<CharacterPanelProp> = ({
	characterPanels,
	setCharacterPanels,
	panelsHandler,
	setPanels,
	submitHandler,
	isSubmitLoading,
	regenerateHandler,
}) => {
	const [selectedChIndxes, setSelectedChIndxes] = useState<number[]>([]);

	useEffect(() => {
		panelsHandler.resetPanel();
		if (characterPanels) {
			try {
				const panelFiles = characterPanels.data
					.filter((_, indx) => selectedChIndxes.includes(indx))
					.flatMap((d) => d.panels)
					.map((p, i) => {
						const fName = getUUID();
						const f = blobToFile(
							b64ToBlob(
								p.panel_data.slice("data:image/png;base64,".length),
								"image/png",
							),
							fName,
							"image/png",
						);
						return {
							file: f,
							name: fName,
							url: URL.createObjectURL(f),
							id: String(i),
							type: "image/png",
							size: 0,
							lastModified: new Date(),
						};
					});

				setPanels((_p) => [
					..._p,
					{
						pageFileName: getUUID(),
						panels: panelFiles,
					},
				]);
			} catch (err) {
				console.error(err);
			}
		}
	}, [selectedChIndxes, characterPanels]);

	return (
		<div className="rounded-md my-2 border-2 border-gray-300 font-roboto p-4 md:p-2 shadow-md bg-gray-50">
			{!characterPanels ? (
				<div className="text-md text-gray-700 w-full text-center inline-flex items-center justify-center gap-2">
					<ExclamationCircleIcon className="size-[24px]" />
					No character detected !
				</div>
			) : (
				<>
					<h1 className="text-gray-800 text-xl font-bold relative w-fit">
						Detected Characters ({characterPanels.data.length})
						<div className="absolute w-full h-1 bg-gray-700 rounded -bottom-1 left-0"></div>
					</h1>

					<div className="flex flex-row flex-wrap justify-center w-full gap-2 my-2">
						{characterPanels.data.map((d, i) => {
							return (
								<button
									onClick={() => {
										console.log("click");
										setSelectedChIndxes((indxs) => {
											if (indxs.includes(i))
												return indxs.filter((idx) => idx !== i);
											else return [...indxs, i];
										});
									}}
									key={i}
									className="border border-gray-300 rounded-md hover:cursor-pointer group relative">
									<img
										src={d.preview}
										alt="Preview"
										className="w-[14rem] h-auto rounded-md border group-hover:scale-[1.01] transition"
									/>
									<div className="text-sm text-gray-700 text-center font-roboto p-1">
										Appear in {d.panels.length} panels
									</div>
									{selectedChIndxes.includes(i) && (
										<div className="absolute top-0 left-0 bg-blue-500/50 backdrop-blur-sm rounded-md ">
											<Check size={32} className="stroke-blue-100" />
										</div>
									)}
								</button>
							);
						})}
					</div>
					<hr className="border-gray-300" />
					<h2 className="text-gray-800 text-lg font-bold relative w-fit my-2">
						Panels{" "}
						{selectedChIndxes.length > 0 && (
							<>
								{
									characterPanels.data
										.filter((d, i) => selectedChIndxes.includes(i))
										.flatMap((d) => d.panels).length
								}
							</>
						)}
					</h2>
					<div className="flex flex-row flex-wrap justify-center w-full gap-2">
						{selectedChIndxes.length === 0 ? (
							<div className="text-center font-roboto text-md text-gray-700 w-full">
								Please, select a character to view its panels
							</div>
						) : (
							selectedChIndxes.map((indx) =>
								characterPanels.data[indx].panels.map((d, j) => (
									<div key={j} className="border rounded-md">
										<img
											src={d.panel_data}
											alt="panel"
											className="w-[12rem] rounded-md"
										/>
										{/* <div className="text-sm text-gray-600">{d.file_name}</div> */}
									</div>
								)),
							)
						)}
					</div>
				</>
			)}
			<hr className="border-gray-300 my-2" />
			{selectedChIndxes.length > 0 && (
				<div className="flex flex-row w-full justify-center gap-2 flex-wrap items-center my-2 mt-4">
					<button
						disabled={isSubmitLoading}
						onClick={submitHandler}
						className="rounded-md bg-gray-600 hover:bg-slate-500 text-white text-md p-2">
						{isSubmitLoading ? (
							<div className="inline-flex items-center gap-2">
								<Loader2 size={18} className="animate-spin" />
								<span>Generating...</span>
							</div>
						) : (
							<div>Generate Speech Bubbles</div>
						)}
						<span></span>
					</button>
					<button
						disabled={isSubmitLoading}
						onClick={regenerateHandler}
						className="rounded-md bg-gray-600 hover:bg-slate-500 text-white text-md p-2">
						Regenerate Characters
					</button>
					<button
						disabled={isSubmitLoading}
						// onClick={props.resetFiles}
						className="rounded-md bg-gray-600 hover:bg-slate-500 text-white text-md p-2">
						Reset
					</button>
				</div>
			)}
		</div>
	);
};

export default CharacterPanel;
