import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import GridSortableImg, { GridSortableProps } from "./grid";
import { InputData } from "./inputData.type";
import { useContext, useRef } from "react";
import ToastsContext from "../hooks/createToastContext";

interface InputImagePreviewProps extends GridSortableProps<InputData> {
	resetFiles: () => void;
	addFiles: (fs: File[]) => InputData[];
	FileInputFileSrc: (e: React.ChangeEvent<HTMLInputElement>) => File[];
	generateHandler: () => void; // Handler for submitting or generating assets
	isGenerateButtonLoading: boolean;
}

const InputImagePreview = (props: InputImagePreviewProps) => {
	const addFilesInputRef = useRef<HTMLInputElement>(null);
	const createToast = useContext(ToastsContext);

	return (
		<>
			<div className="relative w-full h-fit bg-white rounded-lg">
				<GridSortableImg {...props} disabledControl={props.disabledControl} />

				{/* Reset */}
				<button
					title="Reset Panels selection"
					className="block border-none ring-1 rounded-full bg-rose-600/30 backdrop-blur-md w-fit absolute right-2 top-2 z-1 p-0"
					onClick={() => props.setList([])}>
					<XMarkIcon className="w-8 h-8 stroke-rose-600" />
				</button>
				{/* Add More panels */}
				<button
					className="block border-none ring-1 rounded-full bg-blue-300/30 backdrop-blur-md w-fit absolute left-[50%] translate-x-[-50%] md:left-full md:translate-x-[-110%] bottom-2 z-[1] p-0"
					onClick={() => {
						// Simulate input click
						if (addFilesInputRef.current) addFilesInputRef.current.click();
					}}>
					<PlusIcon className="w-16 h-16 stroke-gray-800" />
				</button>
				{/* TODO: Extract component */}
				<input
					ref={addFilesInputRef}
					type="file"
					name="add files"
					multiple
					accept="image/*"
					className="hidden"
					onChange={(e) => {
						const len = props.addFiles(props.FileInputFileSrc(e)).length;
						if (createToast)
							createToast({
								type: "success",
								children: <div>Successfully Uploaded {len} files</div>,
							});
					}}
				/>
			</div>
			{/* Buttons */}
			<div className="flex flex-row w-full justify-center gap-2">
				<button
					disabled={props.disabledControl}
					onClick={props.resetFiles}
					className="rounded-md w-34 bg-gray-600 hover:bg-slate-500 text-white text-xl px-4 py-2">
					Reset
				</button>
				<button
					onClick={props.generateHandler}
					disabled={props.isGenerateButtonLoading}
					className={`rounded-md w-34 bg-gray-600 hover:bg-slate-500 text-white text-xl px-4 py-2 ${
						props.isGenerateButtonLoading
							? " flex flex-row justify-center align-middle gap-1 hover:cursor-wait"
							: ""
					}`}>
					{props.isGenerateButtonLoading && (
						<div className="block">
							<svg
								className="animate-spin bw-[24px] h-[24px]"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24">
								<circle
									className="opacity-25 stroke-slate-100"
									cx="12"
									cy="12"
									r="10"
									strokeWidth="4"></circle>
								<path
									className="opacity-75 fill-white"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						</div>
					)}
					<div className="block">
						{props.isGenerateButtonLoading ? "Generating" : "Generate"}
					</div>
				</button>
			</div>
		</>
	);
};

export default InputImagePreview;
