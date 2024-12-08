import { createContext } from "react";
import { ToastType } from "./toast";

export interface CreateToastArgsI {
	type: ToastType;
	children: React.JSX.Element;
	timer?: number; // in ms
}

export type CreateToastType = (args: CreateToastArgsI) => void;

const createToastContext = () => {
	return createContext<CreateToastType | undefined>(undefined);
};

export default createToastContext;
