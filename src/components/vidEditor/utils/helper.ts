import { VidSettingType } from "../components/editor/type";
import {
	resizeMode,
	vidBackground,
	vidResolution,
	vidTransition,
} from "./constants";

/**
 *
 * @param duration Check wether the duration is valid
 * @returns Array of string containing error message
 * if no error is found, it'll return an empty array
 */
export const checkDuration = (duration: number): string[] => {
	const errs: string[] = [];
	if (duration < 1) errs.push("Duration must be at least 1 second");
	if (duration > 60 * 60) errs.push("Duration must be at most 1 hour");
	return errs;
};

export const checkFPS = (fps: number): string[] => {
	const errs: string[] = [];
	if (fps < 12) errs.push("Frame rate must be at least 12 fps");
	if (fps > 240) errs.push("Frame rate must be at most 240 fps");
	return errs;
};

/**
 *
 * @param vidSettingConfig Check wether the video setting configuration is valid
 * if not valid it'll throw an error, containing message about the wrong input field
 */
const verifiedVidSettingConfig = (vidSettingConfig: VidSettingType) => {
	const errs: string[] = [];
	// Duration validation
	if (vidSettingConfig.duration < 1)
		errs.push("Duration must be at least 1 second");
	if (vidSettingConfig.duration > 60 * 60)
		errs.push("Duration must be at most 1 hour");
	// VidBackground
	if (
		vidBackground.findIndex((bg) => bg === vidSettingConfig.vidBackground) ===
		-1
	)
		errs.push(`VidBackground should be one of ${vidBackground.join(", ")}`);

	// Transition
	if (
		vidTransition.findIndex((tr) => tr === vidSettingConfig.transition) === -1
	)
		errs.push(`Transition must be one of ${vidTransition.join(", ")}`);

	// Frame rate
	if (vidSettingConfig.frameRate < 1)
		errs.push("Frame rate must be at least 1 fps");
	if (vidSettingConfig.frameRate > 240)
		errs.push("Frame rate must be at most 240 fps");

	// Resolution
	if (
		vidResolution.findIndex((res) => res === vidSettingConfig.resolution) === -1
	)
		errs.push(`Resolution must be one of ${vidResolution.join(", ")}`);

	// ResizeMode
	if (resizeMode.findIndex((rm) => rm === vidSettingConfig.resizeMode) === -1)
		errs.push(`Resize Mode must be one of ${resizeMode.join(", ")}`);

	if (errs.length !== 0) throw new Error(errs.join("\n"));
};

export { verifiedVidSettingConfig };
