import { useRef } from "react";
import { FileInputHandler } from "../hooks/useFileInput";

import { PlusIcon, FolderPlusIcon } from "@heroicons/react/24/outline";

interface FileInputProps {
	handlers: FileInputHandler;
}

const FileInput = ({ handlers }: FileInputProps) => {
	const { addFiles, FileDropFileSrc, FileInputFileSrc } = handlers;

	const fileInputRef = useRef<HTMLInputElement>(null);

	return (
		<div
			onDrop={(e) => {
				const fs = FileDropFileSrc(e);
				const res = addFiles(fs);
				console.log(`${res.length} files dropped`);
				// TODO: notify the user of dropped files count using a `toast`
			}}
			onDragOver={(e) => {
				console.log("drag over files...");
				e.preventDefault();
			}}
			className="rounded-lg border-gray-300 border-2 border-solid flex flex-col justify-center items-center px-2 py-4">
			{/* Hidden file picker */}
			<input
				ref={fileInputRef}
				type="file"
				multiple
				accept="image/*"
				className="hidden"
				onChange={(e) => {
					const fs = FileInputFileSrc(e);
					console.log("ff:", fs);
					const res = addFiles(fs);
					console.log(`${res.length} files inputted`);
				}}
			/>
			<div className="border-gray-300 border-2 border-dashed rounded-lg flex flex-col justify-center items-center max-w-sm p-3 text-center">
				<FolderPlusIcon color="grey" width={"3.5rem"} height={"3.5rem"} />
				<div className="text-gray-900 font-bold">No Pages</div>
				<div className="text-gray-500">Get Started by adding comic page.</div>

				<button
					onClick={() => {
						if (fileInputRef && fileInputRef.current)
							fileInputRef.current.click();
					}}
					className="bg-indigo-500 text-white text-center rounded flex flex-row justify-center items-center px-0 pr-2 py-1 m-2"
					style={{
						width: "fit-content",
					}}>
					<div>
						<PlusIcon
							height={"1rem"}
							width={"2rem"}
							fill="white"
							stroke="white"
						/>
					</div>
					<div className="font-sm">Add Pages</div>
				</button>
			</div>
		</div>
	);
};

export default FileInput;
