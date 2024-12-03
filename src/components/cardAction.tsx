import React, { useState } from "react";
import Card from "./card";
import {
	TrashIcon,
	DocumentMagnifyingGlassIcon,
	ArrowLeftCircleIcon,
	ArrowRightCircleIcon,
} from "@heroicons/react/24/outline";

interface CardActionProps {
	disabledControl: boolean;
	children: React.JSX.Element;
	deletePanel: () => void;
	swapPanelLeft: () => void;
	swapPanelRight: () => void;
	modalDataSetter: () => void;
}

const CardAction = ({
	disabledControl,
	children,
	deletePanel,
	swapPanelLeft,
	swapPanelRight,
	modalDataSetter,
}: CardActionProps) => {
	const [showOptn, setShowOptn] = useState<boolean>(false);

	return (
		<Card>
			<div
				className="relative w-fit overflow-hidden"
				onMouseEnter={() => setShowOptn(true)}
				onMouseLeave={() => setShowOptn(false)}>
				{children}

				{/* View Modal Icon */}
				<div
					onClick={modalDataSetter}
					className={`absolute text-white top-0 bg-blue-500/30 backdrop-blur-sm w-8 h-8 rounded flex items-center justify-center ${
						showOptn ? "left-0" : "left-[-30px]"
					} transition-[left] duration-900 hover:cursor-pointer`}
					title="view page">
					<DocumentMagnifyingGlassIcon
						className="w-6 h-6 stroke-white-500 hover:fill-blue-500"
						strokeWidth={2}
					/>
				</div>

				{!disabledControl && (
					<>
						{/* Trash Icon */}
						<div
							onClick={deletePanel}
							className={`absolute text-white top-0 bg-rose-500/30 backdrop-blur-sm w-8 h-8 rounded flex items-center justify-center ${
								showOptn ? "right-0" : "right-[-30px]"
							} transition-[right] duration-900 hover:cursor-pointer`}
							title="delete page">
							<TrashIcon className="w-6 h-6 stroke-white-500 hover:fill-rose-500" />
						</div>

						{/* Arrow Left */}
						<div
							onClick={swapPanelLeft}
							className={`absolute text-white top-[50%] bg-yellow-300/20 backdrop-blur-sm w-8 h-24 rounded flex items-center justify-center ${
								showOptn ? "left-0" : "left-[-30px]"
							} transition-[left] duration-900 translate-y-[-50%] hover:cursor-pointer`}
							title="move page left">
							<ArrowLeftCircleIcon
								className="w-6 h-6 stroke-white-500 hover:fill-yellow-500"
								strokeWidth={2}
							/>
						</div>

						{/* Arrow Right */}
						<div
							onClick={swapPanelRight}
							className={`absolute text-white top-[50%] bg-yellow-300/20 backdrop-blur-sm w-8 h-24 rounded flex items-center justify-center ${
								showOptn ? "right-0" : "right-[-30px]"
							} transition-[right] duration-900 translate-y-[-50%] hover:cursor-pointer`}
							title="move page right">
							<ArrowRightCircleIcon
								className="w-6 h-6 stroke-white-500 hover:fill-yellow-500"
								strokeWidth={2}
							/>
						</div>
					</>
				)}
			</div>
		</Card>
	);
};

export default CardAction;
