// TODO: Add suspense to file dropper
// TODO: Add tailwind loading to wait for fetch request from useFetch hooks
// TODO: Reduce padding for mobile view
// TODO: File Dropper Add Button
// DiscusX, buy me a coffee

import { FC, useState } from "react";
import FileInput from "../components/fileInput";
import useFilesInput from "../hooks/useFileInput";
import ScrollToTopBtn from "../components/scrollToTopBtn";
import InputImagePreview from "../components/inputImgPreview";
import CAccordion from "../components/Accordion/cAccrodion";
import GridSortableImg from "../components/grid";
import { DialogueData } from "../components/inputData.type";

const Home: FC = () => {
	const [inpFiles, setInpFiles, inpFilesHandlers] = useFilesInput();
	const [panels, setPanels, panelsHandler] = useFilesInput();
	const [characters, setCharacters, charactersHandler] = useFilesInput();
	const [dialogues, setDialogues] = useState<DialogueData[]>([]);

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
						FileInputFileSrc={inpFilesHandlers.FileInputFileSrc}
						addFiles={inpFilesHandlers.addFiles}
						generateHandler={() => setPanels([...inpFiles])}
					/>
				</div>
			)}

			{panels.length !== 0 && (
				<div className="bg-white rounded-lg">
					<CAccordion
						disabledControl={true}
						accordionTitleText={`Image Selection ${characters.length} images`}
						resetHandler={inpFilesHandlers.clearFiles}
						addListHandler={inpFilesHandlers.addFiles}
						FileInputFileSrc={inpFilesHandlers.FileInputFileSrc}
						generateHandler={() => {}}
						gridComponent={
							<GridSortableImg
								disabledControl={true}
								list={inpFiles}
								setList={setInpFiles}
								deleteCard={inpFilesHandlers.deleteFile}
								swapCard={inpFilesHandlers.swapFile}
							/>
						}
					/>
				</div>
			)}

			{panels.length !== 0 && (
				<div className="bg-white rounded-lg">
					<CAccordion
						disabledControl={characters.length !== 0}
						accordionTitleText={`Panels Selection ${panels.length} panels`}
						resetHandler={panelsHandler.clearFiles}
						addListHandler={panelsHandler.addFiles}
						FileInputFileSrc={panelsHandler.FileInputFileSrc}
						generateHandler={() => setCharacters([...panels])}
						gridComponent={
							<GridSortableImg
								disabledControl={characters.length !== 0}
								list={panels}
								setList={setPanels}
								deleteCard={panelsHandler.deleteFile}
								swapCard={panelsHandler.swapFile}
							/>
						}
					/>
				</div>
			)}

			{characters.length !== 0 && (
				<div className="bg-white rounded-lg">
					<CAccordion
						disabledControl={dialogues.length !== 0}
						accordionTitleText={`Characters Selection ${characters.length} characters`}
						resetHandler={charactersHandler.clearFiles}
						addListHandler={charactersHandler.addFiles}
						FileInputFileSrc={charactersHandler.FileInputFileSrc}
						generateHandler={() =>
							setDialogues(
								characters.map((d) => ({
									id: Math.floor(Math.random() * 99999),
									text: d.name,
								})),
							)
						}
						gridComponent={
							<GridSortableImg
								disabledControl={dialogues.length !== 0}
								list={characters}
								setList={setCharacters}
								deleteCard={charactersHandler.deleteFile}
								swapCard={charactersHandler.swapFile}
							/>
						}
					/>
				</div>
			)}

			{dialogues.length !== 0 && (
				<div className="text-black">
					<h1>Dialogues</h1>
					{dialogues.map((d, i) => (
						<li key={i}>{d.text}</li>
					))}
				</div>
			)}

			<ScrollToTopBtn />
		</div>
	);
};

export default Home;
