// Generic Model
const Modal = (props: { children: React.JSX.Element }) => {
	return (
		<div className="fixed left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] w-fit h-fit border rounded-2xl border-color-rose-800 bg-gray-800/90 backdrop-blur-md z-[20] overflow-auto">
			{props.children}
		</div>
	);
};

export default Modal;
