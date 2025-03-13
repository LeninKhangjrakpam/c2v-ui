import { VidSettingType } from "../components/editor/type";

export const initSettingConfig: VidSettingType = {
	duration: 30, // second
	vidBackground: "black",
	transition: "None",
	frameRate: 30, // fps
	resolution: 360,
	orientation: "landscape",
	resizeMode: "maintain aspect ratio",
};

export const vidBackground: string[] = ["black", "white"];
export const vidTransition: string[] = ["None"];
export const vidResolution: number[] = [240, 360, 480, 720, 1280];
export const resizeMode: string[] = ["maintain aspect ratio", "stretch"];

// Resolution: [width, height]
export const resolutionMap: { [key: number]: [number, number] } = {
	240: [426, 240],
	360: [640, 360],
	480: [854, 480],
	720: [1280, 720],
	1280: [1920, 1280],
};
