import Toast, { ToastProps } from "./toast";

const ToastContainer = (props: { toasts: ToastProps[] }) => {
	return (
		<div className="border border-green-800 fixed bottom-2 right-2 z-[9]">
			<h1 className="text-black">This is toasts containers !</h1>
			{props.toasts.map((toast, i) => (
				<Toast {...toast} key={i} />
			))}
		</div>
	);
};

export default ToastContainer;
