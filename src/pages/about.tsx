import { FC, useState } from "react";
import FileInput from "../components/fileInput";
import useFilesInput from "../hooks/useFileInput";
import ScrollToTopBtn from "../components/scrollToTopBtn";
import InputImagePreview from "../components/inputImgPreview";
import PageAccordion from "../components/Accordion/PageAccordion";
import GridSortableImg from "../components/grid";
import { DialogueData } from "../components/inputData.type";
import { fileInputFileSrc } from "../utils/formUtils";

const About: FC = () => {
	const [inpFiles, setInpFiles, inpFilesHandlers] = useFilesInput();
	const [panels, setPanels, panelsHandler] = useFilesInput();
	const [characters, setCharacters, charactersHandler] = useFilesInput();
	const [dialogues, setDialogues] = useState<DialogueData[]>([]);

	return (
		<div className="relative">
			<h1 className="text-black">About Page</h1>
			<h1 className="text-black">Count: {inpFiles.length}</h1>

			{inpFiles.length === 0 && <FileInput handlers={inpFilesHandlers} />}
			{inpFiles.length !== 0 && panels.length === 0 && (
				<InputImagePreview
					disabledControl={panels.length !== 0}
					list={inpFiles}
					setList={setInpFiles}
					deleteCard={inpFilesHandlers.deleteFile}
					resetFiles={inpFilesHandlers.clearFiles}
					swapCard={inpFilesHandlers.swapFile}
					FileInputFileSrc={fileInputFileSrc}
					addFiles={inpFilesHandlers.addFiles}
					isGenerateButtonLoading={false}
					generateHandler={() => setPanels([...inpFiles])}
				/>
			)}

			{panels.length !== 0 && (
				<PageAccordion
					disabledControl={true}
					accordionTitleText={`Image Selection ${characters.length} images`}
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
			)}

			{panels.length !== 0 && (
				<PageAccordion
					disabledControl={characters.length !== 0}
					accordionTitleText={`Panels Selection ${panels.length} panels`}
					resetHandler={panelsHandler.clearFiles}
					addListHandler={panelsHandler.addFiles}
					generateHandler={() => setCharacters([...panels])}>
					<GridSortableImg
						disabledControl={characters.length !== 0}
						list={panels}
						setList={setPanels}
						deleteCard={panelsHandler.deleteFile}
						swapCard={panelsHandler.swapFile}
					/>
				</PageAccordion>
			)}

			{characters.length !== 0 && (
				<PageAccordion
					disabledControl={dialogues.length !== 0}
					accordionTitleText={`Characters Selection ${characters.length} characters`}
					resetHandler={charactersHandler.clearFiles}
					addListHandler={charactersHandler.addFiles}
					generateHandler={() =>
						setDialogues(
							characters.map((d) => ({
								id: Math.floor(Math.random() * 99999),
								text: d.name,
							})),
						)
					}>
					<GridSortableImg
						disabledControl={dialogues.length !== 0}
						list={characters}
						setList={setCharacters}
						deleteCard={charactersHandler.deleteFile}
						swapCard={charactersHandler.swapFile}
					/>
				</PageAccordion>
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
export default About;
