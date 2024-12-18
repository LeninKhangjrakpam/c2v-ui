import { getUUID } from "./util";
import { InputData } from "../components/inputData.type";

// Extract File Information
export const extractMetaData = (f: File): InputData => {
	return {
		file: f,
		name: f.name,
		url: URL.createObjectURL(f),
		id: getUUID(),
		type: f.type,
		size: f.size,
		lastModified: new Date(f.lastModified),
	};
};

export const filterImgFiles = (fs: (File | null)[]): File[] => {
	const imgFs: File[] = [];
	for (let i = 0; i < fs.length; i++) {
		const fI = fs[i];
		if (!fI) continue;
		if (/image\/.*/.test(fI.type)) imgFs.push(fI);
	}
	return imgFs;
};

export const fileDropFileSrc = (e: React.DragEvent): File[] => {
	console.log("File Dropped");
	e.preventDefault();
	const dropFiles = e.dataTransfer.files;
	if (dropFiles.length === 0) return [];
	else
		return Array.from({ length: dropFiles.length }, (_, i) =>
			dropFiles.item(i),
		).filter((fs) => fs !== null && fs !== undefined);
};

export const fileInputFileSrc = (
	e: React.ChangeEvent<HTMLInputElement>,
): File[] => {
	console.log("File Form Input");
	e.preventDefault();
	if (!e.target.files || e.target.files.length === 0) return [];
	else
		return Array.from({ length: e.target.files.length }, (_, i) =>
			e.target.files?.item(i),
		).filter((fs) => fs !== null && fs !== undefined);
};
