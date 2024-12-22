// TODO: Add suspense to file dropper
// TODO: Add tailwind loading to wait for fetch request from useFetch hooks
// TODO: Reduce padding for mobile view
// TODO: File Dropper Add Button
// DiscusX, buy me a coffee

import { FC } from "react";
import FileInput from "../components/fileInput";
import useFilesInput from "../hooks/useFileInput";
import ScrollToTopBtn from "../components/scrollToTopBtn";
import InputImagePreview from "../components/inputImgPreview";
import PageAccordion from "../components/Accordion/PageAccordion";
import GridSortableImg from "../components/grid";
import useFetcher from "../hooks/useFetcher";
import usePanelData from "../hooks/usePanelData";
import PanelImgAccordion from "../components/Accordion/PanelImgAccordion";
import { fileInputFileSrc } from "../utils/formUtils";

import {
	UploadPageResponse,
	GenPanelResponse,
	GenAssetResponse,
} from "../api/response.type";
import {
	imageUploadHandler,
	imageUploadPostHandler,
	panelGenPostHandler,
	assetGenHandler,
	assetGenPostHandler,
} from "../utils/fetchHandler";

const Home: FC = () => {
	const [inpFiles, setInpFiles, inpFilesHandlers] = useFilesInput();
	const [panels, setPanels, panelsHandler] = usePanelData();
	const [speechB, setSpeechB, speechBHandler] = usePanelData();

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
						generateHandler={() =>
							setPanels((ps) => {
								assetGenHandler(ps, genAssetFetcher);
								return ps;
							})
						}
					/>
				</div>
			)}

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

export default Home;
