import { ToastType } from "../components/Toast/toast";

export const MaxFileNameLen = 10;

export const ToastTimer = 5000; //	in ms

export const colorMap: Record<ToastType, string> = {
	success: "green",
	warning: "yellow",
	error: "rose",
	information: "blue",
};
