import { useRef, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { colorMap } from "../../utils/constants";

export type ToastType = "success" | "warning" | "error" | "information";

export interface ToastProps {
	id: string | number;
	timer: number;
	type: ToastType;
	children: React.JSX.Element;
	toastCancelHandler: () => void;
}

const Toast = (props: ToastProps) => {
	const color = colorMap[props.type];
	const loadingBarRef = useRef<HTMLDivElement | null>(null);
	const toastTimeoutId = useRef<number | null>(null);

	useEffect(() => {
		if (props.timer !== -1) {
			const animation = [{ width: "100%" }, { width: "0%" }];
			if (loadingBarRef && loadingBarRef.current) {
				loadingBarRef.current.animate(animation, {
					duration: props.timer,
					fill: "forwards",
					iterations: 1,
				});
			}
			toastTimeoutId.current = setTimeout(() => {
				props.toastCancelHandler();
			}, props.timer);
		}
		return () => {
			if (toastTimeoutId && toastTimeoutId.current)
				clearTimeout(toastTimeoutId.current);
		};
	}, []);

	return (
		<div className="relative my-2 p-0">
			<div
				className={`bg-${color}-50 border-l-4 border-l-${color}-500 text-slate-800 shadow-md rounded-e-lg w-fit min-w-[320px] max-w-[100dvw] p-1 px-2 grid grid-cols-12 items-center`}>
				<div className="col-span-11">
					<div className={`text-lg font-bold text-${color}-600`}>
						{props.type.slice(0, 1).toUpperCase() + props.type.slice(1)}
					</div>
					<div>{props.children}</div>
				</div>
				<div className="col-span-1 h-full relative">
					<button
						className="relative h-full"
						onClick={() => {
							props.toastCancelHandler();
							// Abort Timeout, if user close the Toast first
							if (toastTimeoutId && toastTimeoutId.current)
								clearTimeout(toastTimeoutId.current);
						}}>
						<XMarkIcon className="w-6 h-6 stroke-slate-600 fill-slate-600" />
					</button>
				</div>
			</div>
			{props.timer !== -1 && (
				<div
					className={`relative h-1 bg-${color}-500 rounded-sm`}
					ref={loadingBarRef}></div>
			)}
		</div>
	);
};

export default Toast;
