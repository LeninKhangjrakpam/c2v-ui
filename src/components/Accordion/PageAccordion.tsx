import { useRef } from "react";
import { InputData } from "../inputData.type";
import Accordion from "./accordion";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { fileInputFileSrc } from "../../utils/formUtils";

export interface PageAccordionProps {
	accordionTitleText: string;
	disabledControl: boolean;
	children: React.JSX.Element;
	resetHandler?: () => void;
	addListHandler?: (fs: File[]) => InputData[];
	generateHandler?: () => void;
}

const PageAccordion = (props: PageAccordionProps) => {
	const addFilesInputRef = useRef<HTMLInputElement>(null);

	return (
		<Accordion
			containerClassName={
				"w-full rounded-lg border-gray-300 border-2 border-solid my-2"
			}
			headerClassName="bg-gray-500"
			accordionHeader={
				<div className="text-slate-100 text-lg">{props.accordionTitleText}</div>
			}>
			<>
				<div className="relative w-full h-fit">
					{/* Grid */}
					{props.children}

					{!props.disabledControl && (
						<>
							{props.resetHandler && (
								// Reset
								<button
									title="Reset Panels selection"
									className="block border-none ring-1 rounded-full bg-rose-600/30 backdrop-blur-md w-fit absolute right-2 top-2 z-[1] p-0"
									onClick={props.resetHandler}>
									<XMarkIcon className="w-8 h-8 stroke-rose-600" />
								</button>
							)}

							{props.addListHandler && (
								<>
									{/* Add More panels */}
									<button
										className="block border-none ring-1 rounded-full bg-blue-300/30 backdrop-blur-md w-fit absolute left-[50%] translate-x-[-50%] md:left-full md:translate-x-[-110%] bottom-2 z-[1] p-0"
										onClick={() => {
											// Simulate input click
											if (addFilesInputRef.current)
												addFilesInputRef.current.click();
										}}>
										<PlusIcon className="w-16 h-16 stroke-gray-800" />
									</button>
									<input
										ref={addFilesInputRef}
										type="file"
										name="add files"
										multiple
										accept="image/*"
										className="hidden"
										onChange={(e) =>
											props.addListHandler &&
											props.addListHandler(fileInputFileSrc(e))
										}
									/>
								</>
							)}
						</>
					)}
				</div>
				{/* Buttons */}
				{!props.disabledControl && (
					<div className="flex flex-row w-full justify-center gap-2">
						{props.resetHandler && (
							<button
								onClick={props.resetHandler}
								className="rounded-md w-32 bg-gray-600 hover:bg-slate-500 text-white text-xl px-4 py-2">
								Reset
							</button>
						)}
						{props.generateHandler && (
							<button
								onClick={props.generateHandler}
								className="rounded-md w-32 bg-gray-600 hover:bg-slate-500 text-white text-xl px-4 py-2">
								Generate
							</button>
						)}
					</div>
				)}
			</>
		</Accordion>
	);
};
export default PageAccordion;
