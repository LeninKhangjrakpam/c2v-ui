import { useState } from "react";
import { ToastProps } from "../components/Toast/toast";
import {
	CreateToastType,
	CreateToastArgsI,
} from "../components/Toast/createToastContext";

import { getUUID } from "../utils/util";

const useToast = (): [toasts: ToastProps[], createToast: CreateToastType] => {
	const [toasts, setToasts] = useState<ToastProps[]>([]);

	// useEffect(() => {
	// 	Array.from({ length: 7 }, (_, i) =>
	// 		createToast({
	// 			type: "error",
	// 			timer: 1000,
	// 			children: <div>This is a test {i}</div>,
	// 		}),
	// 	);
	// }, []);

	const ToastCancel = (toastId: number | string) => {
		setToasts((toasts) => {
			const isvalidId = toasts.findIndex((t) => t.id == toastId) !== -1;
			if (isvalidId) return toasts.filter((t) => t.id !== toastId);
			else
				throw new Error(
					`invalid Toast id, provided id: ${toastId}, avail ToastLen: ${
						toasts.length
					}, ids: ${toasts.map((d) => d.id).join(",")}`,
				);
		});
	};

	const createToast = ({ type, children, timer }: CreateToastArgsI) => {
		const toastId = getUUID();
		setToasts((oldToasts) => [
			...oldToasts,
			{
				type,
				children,
				id: toastId,
				timer: timer ? timer : -1,
				toastCancelHandler: () => ToastCancel(toastId),
			},
		]);
	};

	return [toasts, createToast];
};

export default useToast;
