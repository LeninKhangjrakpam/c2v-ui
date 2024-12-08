import React, { useState } from "react";
import { ChevronUpIcon } from "@heroicons/react/16/solid";

interface AccordionProps {
	accordionHeader: React.JSX.Element;
	children: React.JSX.Element;
	containerClassName?: string;
	headerClassName?: string;
}

const Accordion = (props: AccordionProps) => {
	const [viz, setViz] = useState<boolean>(true);

	return (
		<div className={`${props?.containerClassName}`}>
			{/* Accordion Header */}
			<div
				className={
					"relative w-full p-2 border rounded-lg grid grid-cols-12 items-center " +
					props?.headerClassName
				}>
				<div className="col-span-11">{props.accordionHeader}</div>
				<button
					onClick={() => setViz((d) => !d)}
					className="block border w-fit h-fit rounded-full colspan-1 p-0 m-0 justify-self-end bg-slate-100">
					<ChevronUpIcon
						className={`stroke-slate-500 w-10 h-10 ${
							viz ? "rotate-0" : "rotate-180"
						} transition duration-400`}
					/>
				</button>
			</div>

			{/* Accordion Body */}
			<div
				className={`${
					viz ? "h-fit p-2" : "h-0"
				} transition overflow-hidden duration-1000`}>
				{props.children}
			</div>
		</div>
	);
};

export default Accordion;
