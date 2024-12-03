import React, { useRef } from "react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";

interface InpImgPrevPropI {
	gridComponent: React.JSX.Element;
	resetHandler: () => void;
	addListHandler: () => void;
	generateHandler: () => void;
	disabledControl: boolean;
}

const InpImgPrev = (props: InpImgPrevPropI) => {
	const addImgInputRef = useRef<HTMLInputElement>(null);

	return (
		<>
			<div className="relative w-fit h-fit">
				{/* Grid */}
				{props.gridComponent}

				{!props.disabledControl && (
					<>
						{/* Reset */}
						<button
							title="Reset Panels selection"
							className="block border-none ring-1 rounded-full bg-rose-600/30 backdrop-blur-md w-fit absolute right-2 top-2 z-[1] p-0"
							onClick={props.resetHandler}>
							<XMarkIcon className="w-8 h-8 stroke-rose-600" />
						</button>

						{/* Add More panels */}
						<button
							className="block border-none ring-1 rounded-full bg-blue-300/30 backdrop-blur-md w-fit absolute left-[50%] translate-x-[-50%] md:left-full md:translate-x-[-110%] bottom-2 z-[1] p-0"
							onClick={() => {
								// Simulate input click
								if (addImgInputRef.current) addImgInputRef.current.click();
							}}>
							<PlusIcon className="w-16 h-16 stroke-gray-800" />
						</button>
						<input
							ref={addImgInputRef}
							type="file"
							name="add files"
							multiple
							accept="image/*"
							className="hidden"
							onChange={props.addListHandler}
						/>
					</>
				)}
			</div>
			{/* Buttons */}
			{!props.disabledControl && (
				<div className="flex flex-row w-full justify-center gap-2">
					<button
						onClick={props.resetHandler}
						className="rounded-md w-32 bg-gray-600 hover:bg-slate-500 text-white text-xl px-4 py-2">
						Reset
					</button>
					<button
						onClick={props.generateHandler}
						className="rounded-md w-32 bg-gray-600 hover:bg-slate-500 text-white text-xl px-4 py-2">
						Generate
					</button>
				</div>
			)}
		</>
	);
};

export default InpImgPrev;
