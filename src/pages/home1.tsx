// TODO: Add suspense to file dropper
// TODO: Add tailwind loading to wait for fetch request from useFetch hooks
// TODO: Reduce padding for mobile view
// TODO: File Dropper Add Button
// DiscusX, buy me a coffee

import { FC, useState } from "react";
import FileInput from "../components/fileInput";
import useFilesInput, { FileInputHandler } from "../hooks/useFileInput";
import ScrollToTopBtn from "../components/scrollToTopBtn";
import InputImagePreview from "../components/inputImgPreview";
import PageAccordion from "../components/Accordion/PageAccordion";
import GridSortableImg from "../components/grid";
import useFetcher from "../hooks/useFetcher";
import usePanelData, { PanelDataHandler } from "../hooks/usePanelData";
import PanelImgAccordion from "../components/Accordion/PanelImgAccordion";
import { fileInputFileSrc } from "../utils/formUtils";

import {
	UploadPageResponse,
	GenPanelResponse,
	GenAssetResponse,
	RecogniseTextResponse,
	GenerateAudioReq,
	GenerateAudioResponse,
} from "../api/response.type";
import {
	imageUploadHandler,
	imageUploadPostHandler,
	panelGenPostHandler,
	assetGenHandler,
	assetGenPostHandler,
} from "../utils/fetchHandler";
import {
	InputData,
	PanelData,
	SpeechBubbleData,
	SpeechData,
} from "../components/inputData.type";
import { b64ToBlob, blobToFile, getUUID } from "../utils/util";

const Home: FC = () => {
	const [inpFiles, setInpFiles, inpFilesHandlers] = useFilesInput();
	const [panels, setPanels, panelsHandler] = usePanelData();
	const [speechB, setSpeechB, speechBHandler] = usePanelData();
	const [speechBubble, setSpeechBubble] = useState<SpeechBubbleData[]>([]);
	const [speechData, setSpeechData] = useState<SpeechData[]>([]);

	const [isSBGenerating, setIsSBGenerating] = useState<boolean>(false);
	const [audUrl, setAudUrl] = useState<string>("");

	const genPanelFetcher = useFetcher<GenPanelResponse>(
		async (res) => res.json(),
		(res) => panelGenPostHandler(res, panelsHandler),
	);

	const uploadPageFetcher = useFetcher<UploadPageResponse>(
		async (res) => res.json(),
		(res) => imageUploadPostHandler(res, inpFilesHandlers, genPanelFetcher),
	);

	const genAssetFetcher = useFetcher<GenAssetResponse>(
		async (res) => res.json(),
		(res) => assetGenPostHandler(res, speechBHandler),
	);

	// Submit panel and get speech bubbles
	const panelSubmit = async () => {
		setIsSBGenerating(true);
		const pageFileName: Record<string, string> = {};
		panels.forEach((panel) => (pageFileName[panel.pageFileName] = ""));
		const data = { panels: pageFileName };
		console.log("Panel Data submitted: ", data);
		try {
			const res = await fetch("http://localhost:8000/generateAssets", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			const d = (await res.json()) as GenAssetResponse;
			console.log(d);
			// Update Speech bubble data
			setSpeechBubble([]);
			const sbsData: SpeechBubbleData[] = [];
			for (const panelFN in d) {
				const sbs = d[panelFN].map((s) => {
					const fExt = s.filename.split(".").pop();
					const mimeTye = `image/${fExt}`;
					const blb = b64ToBlob(s.blob, mimeTye);
					const f = blobToFile(blb, s.filename, mimeTye, Date.now());
					return {
						file: f,
						name: s.filename,
						url: URL.createObjectURL(f),
						id: getUUID(),
						type: f.type,
						size: f.size,
						lastModified: new Date(f.lastModified),
					};
				});
				sbsData.push({ panelFileName: panelFN, speechBubbles: sbs });
			}
			console.log(sbsData);
			setSpeechBubble(sbsData);
		} catch (err) {
			console.error("Panel Submit Error: ", err);
		} finally {
			setIsSBGenerating(false);
		}
	};

	const recogniseText = async () => {
		const sbsFN: Record<string, string>[] = [];
		for (let sb of speechBubble) {
			sb.speechBubbles.forEach((s) => {
				sbsFN.push({
					speechBubbleFileName: s.name,
					panelName: sb.panelFileName,
				});
			});
		}

		console.log("SBS", sbsFN);
		try {
			const res = await fetch("http://localhost:8000/recogniseText", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(sbsFN),
			});
			const d = (await res.json()) as RecogniseTextResponse;
			console.log(d);
			// Update Speech bubble data
			setSpeechData([]);

			setSpeechData(
				d.map(
					({ panelFileName, speechBubbleFileName, text }) =>
						({
							panelFileName,
							speechBubbleFileName,
							text,
							audio: null,
							audioLen: 0,
						} as SpeechData),
				),
			);
		} catch (err) {
			console.error("RecognisedText submit Error: ", err);
		}
	};

	const generateAudio = async () => {
		console.log("generate AUDIO");

		const reqData: GenerateAudioReq[] = speechData.map((s) => ({
			panelFileName: s.panelFileName,
			speechBubbleFileName: s.speechBubbleFileName,
			text: s.text,
		}));

		try {
			const res = await fetch("http://localhost:8000/generateAudio", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(reqData),
			});
			const d = (await res.json()) as GenerateAudioResponse;
			setSpeechData([]);
			setSpeechData(
				d.map((sd) => {
					const blob = b64ToBlob(sd.audio, `audio/${sd.audExt}`);
					const lMod = new Date();
					const file = blobToFile(
						blob,
						sd.panelName + sd.speechBubbleFileName,
						`audio/${sd.audExt}`,
						lMod.getMilliseconds(),
					);

					const iData: InputData = {
						file,
						name: sd.panelName + sd.speechBubbleFileName,
						url: URL.createObjectURL(blob),
						id: getUUID(),
						type: `audio/${sd.audExt}`,
						size: 0,
						lastModified: lMod,
					};

					return {
						panelFileName: sd.panelName,
						speechBubbleFileName: sd.speechBubbleFileName,
						text: sd.text,
						audio: iData,
						audioLen: 0,
					};
				}),
			);
		} catch (err) {
			console.error("AUdio gen err: ", err);
		}
	};

	return (
		<div className="relative">
			<h1 className="text-gray-600 font-roboto pt-1 pb-8 text-2xl font-extrabold">
				Comic to Video Generation
			</h1>

			{inpFiles.length === 0 && (
				<div className="bg-white rounded-lg">
					<FileInput handlers={inpFilesHandlers} />
				</div>
			)}

			{inpFiles.length !== 0 && panels.length === 0 && (
				<div>
					<InputImagePreview
						disabledControl={panels.length !== 0}
						list={inpFiles}
						setList={setInpFiles}
						deleteCard={inpFilesHandlers.deleteFile}
						resetFiles={inpFilesHandlers.clearFiles}
						swapCard={inpFilesHandlers.swapFile}
						FileInputFileSrc={fileInputFileSrc}
						addFiles={inpFilesHandlers.addFiles}
						isGenerateButtonLoading={
							uploadPageFetcher.isLoading || genPanelFetcher.isLoading
						}
						generateHandler={() =>
							setInpFiles((inpFs) => {
								imageUploadHandler(inpFs, uploadPageFetcher);
								return inpFs;
							})
						}
					/>
				</div>
			)}

			{panels.length !== 0 && (
				<div className="bg-white rounded-lg">
					<PageAccordion
						disabledControl={true}
						accordionTitleText={`Image Selection ${inpFiles.length} images`}
						resetHandler={inpFilesHandlers.clearFiles}
						addListHandler={inpFilesHandlers.addFiles}
						generateHandler={() => {}}>
						<GridSortableImg
							disabledControl={true}
							list={inpFiles}
							setList={setInpFiles}
							deleteCard={inpFilesHandlers.deleteFile}
							swapCard={inpFilesHandlers.swapFile}
						/>
					</PageAccordion>
				</div>
			)}

			{panels.length !== 0 && (
				<div className="bg-white rounded-lg">
					<PanelImgAccordion
						accordionTitleText={`Panel Selection ${panels.reduce(
							(acc, ps) => acc + ps.panels.length,
							0,
						)} panels`}
						panels={panels}
						setPanels={setPanels}
						panelDataHandler={panelsHandler}
						disabledControl={speechB.length !== 0}
						generateHandler={() => {
							// Submit Panel and fetch speech bubbles
							panelSubmit();
							console.log("panel submitted");
						}}
						// generateHandler={() =>
						// 	setPanels((ps) => {
						// 		assetGenHandler(ps, genAssetFetcher);
						// 		return ps;
						// 	})
						// }
					/>
				</div>
			)}

			{speechBubble.length !== 0 && (
				<div className="bg-white rounded-lg text-black p-2">
					{panels.map((panel, pI) => {
						return (
							<div key={pI} className="border border-gray-400 rounded p-2 my-1">
								<div>FileName: {panel.pageFileName}</div>
								{panel.panels.map((pn, pnI) => {
									return (
										<div
											key={pnI}
											className="border border-gray-400 rounded p-2">
											PanelName: {pn.name}
											<div className="flex gap-1 overflow-x-auto">
												{speechBubble
													.find((d) => d.panelFileName === pn.name)
													?.speechBubbles.map((s, sI) => {
														return (
															<div
																key={sI}
																className="border border-rose-300 rounded-md">
																<img src={s.url} height={100} width="auto" />
																<div title={s.name}>{s.name.slice(10)}</div>
															</div>
														);
													})}
											</div>
										</div>
									);
								})}
							</div>
						);
					})}
				</div>
			)}

			{speechBubble.length !== 0 && speechData.length === 0 && (
				<div className="relative w-full text-center">
					<button
						className="rounded-lg bg-blue-500 p-2 text-lg text-center"
						onClick={recogniseText}>
						Recognise Text
					</button>
				</div>
			)}

			{speechData.length !== 0 && (
				<div className="relative w-full text-center">
					{speechData.map((d, i) => (
						// <div className="border border-gray-500 text-black">{d.text}</div>
						<div key={i} className="flex flex-nowrap border rounded my-1">
							<input
								className="rounded border border-gray-500 text-black bg-transparent w-full"
								type="text"
								value={d.text}
								onChange={(e) =>
									setSpeechData((d) => {
										d[i].text = e.target.value;
										return [...d];
									})
								}
							/>
							{d.audio && <audio src={d.audio.url} controls />}
							<br />
						</div>
					))}

					<div className="relative w-full text-center">
						<button
							className="rounded-lg bg-blue-500 p-2 text-lg text-center"
							onClick={() => {
								console.log("Fetch Audio");
								generateAudio();

								// fetch("http://localhost:8000/generateTestAudio")
								// 	.then((d) => d.json())
								// 	.then((d) => {
								// 		// const aud = new Audio("data:audio/mp3;base64," + d.blob);
								// 		// aud.play();

								// 		let raw = window.atob(d.blob);
								// 		let rawLength = raw.length;
								// 		let arr = new Uint8Array(new ArrayBuffer(rawLength));

								// 		for (let i = 0; i < rawLength; i++) {
								// 			arr[i] = raw.charCodeAt(i);
								// 		}

								// 		const audioBlob = new Blob([arr], {
								// 			type: "audio/mp3",
								// 		});
								// 		const audioUrl = URL.createObjectURL(audioBlob);
								// 		console.log(audioUrl);
								// 		setAudUrl(audioUrl);
								// 	})
								// 	.catch((err) => console.error("audio fetch error: ", err));
							}}>
							{speechData.length !== 0 && speechData[0].audio
								? "Regenerate Audio"
								: "Generate Audio"}
						</button>
					</div>
				</div>
			)}

			{audUrl.length !== 0 && (
				<div className="text-black">
					<a href={audUrl} target="_blank">
						{audUrl}
					</a>
					<audio
						src={audUrl}
						controlsList="nodownload noremoteplayback"
						controls
					/>
				</div>
			)}

			{/* TODO */}
			{speechB.length !== 0 && (
				<div className="bg-white rounded-lg">
					<PanelImgAccordion
						accordionTitleText={`Speech Bubble Selection ${speechB.reduce(
							(acc, sb) => acc + sb.panels.length,
							0,
						)} bubbles`}
						panels={speechB}
						setPanels={setSpeechB}
						panelDataHandler={speechBHandler}
						disabledControl={false}
						generateHandler={() => {
							console.log("gen Video");
							console.log(
								speechB.map((d) => [d.pageFileName, d.panels.length]),
							);
						}}
					/>
				</div>
			)}

			<ScrollToTopBtn />
		</div>
	);
};