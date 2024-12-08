import React, { useState } from "react";
import { InputData } from "../components/inputData.type";
import { getUUID } from "../utils/util";

export interface FileInputHandler {
	addInputDatas: (file: InputData | InputData[]) => InputData[];
	addFiles: (fs: File[]) => InputData[];
	deleteFile: (indx: number) => boolean;
	swapFile: (i: number, j: number) => boolean;
	clearFiles: () => void;
	FileDropFileSrc: (e: React.DragEvent) => File[];
	FileInputFileSrc: (e: React.ChangeEvent<HTMLInputElement>) => File[];
}

const useFilesInput = (): [
	files: InputData[],
	setFiles: React.Dispatch<React.SetStateAction<InputData[]>>,
	handlers: FileInputHandler,
] => {
	const [files, setFiles] = useState<InputData[]>([]);

	// Extract File Information
	const extractMetaData = (f: File): InputData => {
		return {
			// file: fI
			name: f.name,
			url: URL.createObjectURL(f),
			id: getUUID(),
			type: f.type,
			size: f.size,
			lastModified: new Date(f.lastModified),
		};
	};

	const filterImgFiles = (fs: (File | null)[]): File[] => {
		const imgFs: File[] = [];
		for (let i = 0; i < fs.length; i++) {
			const fI = fs[i];
			if (!fI) continue;
			if (/image\/.*/.test(fI.type)) imgFs.push(fI);
		}
		return imgFs;
	};

	const FileDropFileSrc = (e: React.DragEvent): File[] => {
		console.log("File Dropped");
		e.preventDefault();
		const dropFiles = e.dataTransfer.files;
		if (dropFiles.length === 0) return [];
		else
			return Array.from({ length: dropFiles.length }, (_, i) =>
				dropFiles.item(i),
			).filter((fs) => fs !== null && fs !== undefined);
	};

	const FileInputFileSrc = (e: React.ChangeEvent<HTMLInputElement>): File[] => {
		console.log("File Form Input");
		e.preventDefault();
		if (!e.target.files || e.target.files.length === 0) return [];
		else
			return Array.from({ length: e.target.files.length }, (_, i) =>
				e.target.files?.item(i),
			).filter((fs) => fs !== null && fs !== undefined);
	};

	/**
	 *
	 * @param file
	 * @returns Return the Input Datas that are newly added
	 */
	const addInputDatas = (file: InputData | InputData[]): InputData[] => {
		if (file instanceof Array) {
			setFiles((d) => [...d, ...file]);
			return file;
		} else {
			setFiles((d) => [...d, file]);
			return [file];
		}
	};

	const addFiles = (fs: File[]): InputData[] => {
		if (fs.length === 0) return [];
		const imgFiles = filterImgFiles(fs);
		const inpDs = imgFiles.map((d) => extractMetaData(d));
		return addInputDatas(inpDs);
	};

	/**
	 *
	 * @param indx
	 * @returns Return `true` on successfull deletion
	 */
	const deleteFile = (indx: number): boolean => {
		if (indx < 0 || indx >= files.length) return false;
		// Revoke Url
		URL.revokeObjectURL(files[indx].url);
		setFiles((d) => d.filter((_, i) => i !== indx));
		return true;
	};

	const swapFile = (i: number, j: number): boolean => {
		if (i < 0 || i >= files.length || j < 0 || j >= files.length) return false;
		setFiles((fs) => {
			const nFs = [...fs];
			const tmp = nFs[j];
			nFs[j] = nFs[i];
			nFs[i] = tmp;
			return nFs;
		});
		return true;
	};

	const clearFiles = (): void => {
		// Revoke each object url before clearing File
		files.forEach((fs) => URL.revokeObjectURL(fs.url));
		setFiles([]);
	};

	return [
		files,
		setFiles,
		{
			addInputDatas,
			addFiles,
			swapFile,
			clearFiles,
			deleteFile,
			FileDropFileSrc,
			FileInputFileSrc,
		},
	];
};

// addInputDatas: (file: InputData | InputData[]) => InputData[];
// addFiles: (fs: File[]) => InputData[];
// deleteFile: (indx: number) => boolean;
// swapFile: (i: number, j: number) => void;
// clearFiles: () => void;

// export enum InputDataActionKind {
// 	addInputDatas,
// 	addFiles,
// 	deleteFile,
// 	swapFile,
// 	clearFiles,
// }

// type InputDataAction =
// 	| {
// 			type: InputDataActionKind.addInputDatas;
// 			payload: InputData | InputData[];
// 	  }
// 	| { type: InputDataActionKind.addFiles; payload: File[] }
// 	| { type: InputDataActionKind.clearFiles }
// 	| { type: InputDataActionKind.deleteFile; payload };

// const FileInputReducer = (state: InputData[], action: ) => {}

export default useFilesInput;
