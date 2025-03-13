import { useContext, useRef } from "react";
import { FileInputHandler } from "../hooks/useFileInput";

import { PlusIcon, FolderPlusIcon } from "@heroicons/react/24/outline";
import ToastsContext from "../hooks/createToastContext";
import { ToastTimer } from "../utils/constants";
import { fileDropFileSrc, fileInputFileSrc } from "../utils/formUtils";

interface FileInputProps {
	handlers: FileInputHandler;
}

const FileInput = ({ handlers }: FileInputProps) => {
	const { addFiles } = handlers;

	const fileInputRef = useRef<HTMLInputElement>(null);

	const createToast = useContext(ToastsContext);

	return (
		<div
			onDrop={(e) => {
				const fs = fileDropFileSrc(e);
				const res = addFiles(fs);
				console.log(`${res.length} files dropped`);
				// TODO: notify the user of dropped files count using a `toast`
				if (createToast)
					createToast({
						type: "success",
						timer: ToastTimer,
						children: <div>Successfully Uploaded {res.length} files</div>,
					});
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
					const fs = fileInputFileSrc(e);
					console.log("ff:", fs);
					const res = addFiles(fs);
					console.log(`${res.length} files inputted`);
					if (createToast) {
						if (fs.length !== res.length) {
							createToast({
								type: "warning",
								timer: 5000,
								children: (
									<div>
										{res.length}/{fs.length} is found valid
									</div>
								),
							});
						} else
							createToast({
								type: "success",
								timer: 5000,
								children: <div>Successfully Uploaded {res.length} files</div>,
							});
					}
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
					className="bg-indigo-500 text-white text-center rounded flex flex-row justify-center items-center px-0 m-2"
					style={{
						width: "fit-content",
					}}>
					<div className="h-100 py-1">
						<PlusIcon
							height={"1rem"}
							width={"2rem"}
							fill="white"
							stroke="white"
						/>
					</div>
					<div className="font-sm mr-2 py-1 pl-2 h-full border-l border-indigo-700">
						Add Pages
					</div>
				</button>
			</div>
		</div>
	);
};

export default FileInput;
